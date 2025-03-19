import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  TextField, 
  Button, 
  Divider, 
  Badge, 
  IconButton,
  InputAdornment,
  alpha,
  styled
} from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { 
  Send as SendIcon, 
  PersonOutline as PersonIcon, 
  SearchOutlined as SearchIcon,
  MessageOutlined as MessageIcon,
  ChatBubbleOutline as ChatIcon
} from '@mui/icons-material';
import { notifySuccess, notifyError } from '../../components/notification/ToastNotification.jsx';
import io from 'socket.io-client';
import apiConfig from '../../configs/apiConfig.jsx';
import Loading from '../../components/loading/Loading.jsx';
import {jwtDecode} from "jwt-decode";
import authService from "../../services/AuthService.jsx";

// Animation keyframes
const fadeIn = keyframes(`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`);

// Styled components
const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 100px)',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
  animation: `${fadeIn} 0.5s ease-out`,
}));

const UserList = styled(Paper)(({ theme }) => ({
  width: '30%',
  maxWidth: '350px',
  overflowY: 'auto',
  borderRight: `1px solid ${theme.palette.divider}`,
  background: alpha(theme.palette.background.paper, 0.8),
}));

const ChatArea = styled(Paper)(({ theme }) => ({
  width: '70%',
  display: 'flex',
  flexDirection: 'column',
  background: alpha(theme.palette.background.paper, 0.7),
}));

const MessageList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const MessageBubble = styled(Paper)(({ theme, isAdmin }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: isAdmin ? '16px 16px 0 16px' : '16px 16px 16px 0',
  maxWidth: '100%',
  wordWrap: 'break-word',
  marginBottom: theme.spacing(1.5),
  alignSelf: isAdmin ? 'flex-end' : 'flex-start',
  background: isAdmin 
    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` 
    : theme.palette.background.default,
  color: isAdmin ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.1)}`,
}));

const MessageInputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const SearchInputWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2, 1),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const NoConversation = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: theme.palette.text.secondary,
  gap: theme.spacing(2),
}));

const ChatInterface = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userNames, setUserNames] = useState({});
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const conversationTimeoutRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Initialize socket connection - chỉ kết nối một lần
  useEffect(() => {
    // Tạo kết nối socket
    socketRef.current = io(apiConfig.baseUrl);
    
    // Khi kết nối thành công, yêu cầu danh sách người dùng
    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
      socketRef.current.emit('get_users_with_chats');
    });
    
    // Setup polling để liên tục lấy danh sách người dùng có chat mới
    const fetchUsersInterval = setInterval(() => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('get_users_with_chats');
      }
    }, 3000); // Check mỗi 5 giây
    
    // Nhận danh sách người dùng có chat
    socketRef.current.on('users_with_chats', (chatUsers) => {
      console.log('Received users with chats:', chatUsers);
      setUsers(chatUsers || []);
      setFilteredUsers(chatUsers || []);
    });
    
    // Lắng nghe cập nhật trạng thái người dùng
    socketRef.current.on('user_status_update', ({ userId, online }) => {
      console.log('User status update:', userId, online);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, online } : user
        )
      );
    });

    return () => {
      // Dọn dẹp kết nối khi component unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      // Xóa timeout và interval nếu có
      if (conversationTimeoutRef.current) {
        clearTimeout(conversationTimeoutRef.current);
      }
      clearInterval(fetchUsersInterval);
    };
  }, []); // Chỉ chạy một lần khi component mount

  // Setup polling interval cho lịch sử tin nhắn khi có selectedUser
  useEffect(() => {
    // Xóa interval cũ nếu có
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Nếu có selected user, thiết lập interval để cập nhật liên tục
    if (selectedUser && socketRef.current) {
      // Thiết lập polling interval để liên tục lấy tin nhắn mới
      pollingIntervalRef.current = setInterval(() => {
        if (socketRef.current && socketRef.current.connected) {
          console.log('Polling for new messages with user:', selectedUser.id);
          socketRef.current.emit('get_conversation', { userId: selectedUser.id });
        }
      }, 3000); // Cập nhật mỗi 3 giây
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [selectedUser]);

  // Thiết lập lắng nghe tin nhắn mới
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.off('receive_message');

    socketRef.current.on('receive_message', (data) => {
      try {
        console.log('Received message via socket:', data);
        
        if (selectedUser) {
          // Format tin nhắn mới nhận
          const newMessage = {
            senderId: data.sender.id,
            content: data.message,
            timestamp: data.timestamp,
            read: data.read,
            role: data.sender.role
          };
          
          // Thêm tin nhắn vào state nếu đang chat với người gửi hoặc là tin nhắn của admin
          if (data.sender.id === selectedUser.id || data.sender.role === 'ADMIN') {
            setMessages(prevMessages => {
              // Kiểm tra xem tin nhắn đã tồn tại chưa (tránh duplicate)
              const isDuplicate = prevMessages.some(msg => 
                msg.content === newMessage.content && 
                msg.timestamp === newMessage.timestamp &&
                msg.senderId === newMessage.senderId
              );
              
              return isDuplicate ? prevMessages : [...prevMessages, newMessage];
            });
            
            if (data.sender.role === 'USER') {
              socketRef.current.emit('mark_messages_read', { userId: selectedUser.id });
            }
          }
        }
        
        if (data.sender.role === 'USER' && (!selectedUser || data.sender.id !== selectedUser.id)) {
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.id === data.sender.id 
                ? { 
                  ...user, 
                  unreadCount: (user.unreadCount || 0) + 1,
                  lastMessage: data.message
                }
                : user
            )
          );
        }
      } catch (error) {
        console.error('Error handling receive_message:', error);
      }
    });

    return () => {
      socketRef.current.off('receive_message');
    };
  }, [selectedUser]);

  // Xử lý sự kiện conversation_history từ server
  useEffect(() => {
    if (!socketRef.current) return;
    
    // Xóa listener cũ trước khi thêm mới
    socketRef.current.off('conversation_history');
    
    // Lắng nghe lịch sử conversation
    socketRef.current.on('conversation_history', (conversation) => {
      if (!selectedUser) return;
      
      console.log('Received conversation history:', conversation);
      
      // Chuyển đổi định dạng tin nhắn từ server
      const formattedMessages = (conversation || []).map(msg => ({
        senderId: msg.sender.id,
        content: msg.message,
        timestamp: msg.timestamp,
        read: msg.read,
        role: msg.sender.role
      }));
      
      setMessages(formattedMessages);
      setIsLoading(false);
      
      // Đánh dấu tất cả tin nhắn đã đọc
      if (selectedUser.unreadCount > 0) {
        socketRef.current.emit('mark_messages_read', { userId: selectedUser.id });
        
        // Cập nhật UI để xóa badge unread
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === selectedUser.id ? { ...u, unreadCount: 0 } : u
          )
        );
      }
      
      // Xóa timeout vì đã nhận được dữ liệu
      if (conversationTimeoutRef.current) {
        clearTimeout(conversationTimeoutRef.current);
      }
    });
    
    return () => {
      socketRef.current.off('conversation_history');
    };
  }, [selectedUser]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Fetch thông tin người dùng khi danh sách users thay đổi
  useEffect(() => {
    const fetchUserNames = async () => {
      const userNamesMap = { ...userNames };
      const newUsers = users.filter(user => !userNamesMap[user.id]);
      
      for (const user of newUsers) {
        try {
          const response = await authService.getUserInfo(user.id);
          if (response.status === 200) {
            userNamesMap[user.id] = `${response.data.username} - ${response.data.fullname}`;
          } else {
            userNamesMap[user.id] = `User ${user.id}`;
          }
        } catch (e) {
          console.error('Error fetching user info:', e.message);
          userNamesMap[user.id] = `User ${user.id}`;
        }
      }
      
      setUserNames(userNamesMap);
    };
    
    if (users.length > 0) {
      fetchUserNames();
    }
  }, [users]);

  // Select a user and load conversation
  const handleSelectUser = async (user) => {
    if (!socketRef.current || !socketRef.current.connected) {
      notifyError('Mất kết nối socket, vui lòng làm mới trang');
      return;
    }

    // Hủy timeout cũ nếu có
    if (conversationTimeoutRef.current) {
      clearTimeout(conversationTimeoutRef.current);
    }

    setSelectedUser(user);
    setIsLoading(true); // Set loading state
    setMessages([]); // Xóa tin nhắn cũ trước khi tải tin nhắn mới
    
    try {
      console.log('Joining chat with user:', user.id);
      
      // Đặt timeout phòng trường hợp không nhận được phản hồi
      conversationTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          notifyError('Không thể tải tin nhắn. Server không phản hồi');
          console.error('Timeout waiting for conversation_history');
        }
      }, 10000); // 10 giây timeout

      socketRef.current.emit('admin_join_chat', user.id);
      
      // Yêu cầu lịch sử chat
      socketRef.current.emit('get_conversation', { userId: user.id });
    } catch (error) {
      console.error('Error in handleSelectUser:', error);
      notifyError('Không thể tải tin nhắn: ' + (error.message || 'Lỗi không xác định'));
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !socketRef.current) return;
    
    try {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);

      console.log('Sending message to user:', selectedUser.id, newMessage);

      socketRef.current.emit('send_message', {
        userId: selectedUser.id,
        sender: {
          id: decode.userId,
          role: 'ADMIN'
        },
        message: newMessage
      });
      

      const messageToDisplay = {
        senderId: decode.userId,
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: true,
        role: 'ADMIN'
      };
      
      setMessages(prevMessages => [...prevMessages, messageToDisplay]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      notifyError('Không thể gửi tin nhắn: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  // Handle key press for message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format date for messages
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Tin nhắn từ Khách hàng
      </Typography>
      
      <ChatContainer>
        {isLoading && <Loading />}
        
        {/* User List */}
        <UserList elevation={0}>
          <SearchInputWrapper>
            <TextField
              fullWidth
              placeholder="Tìm kiếm người dùng..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: '12px' }
              }}
            />
          </SearchInputWrapper>
          
          <Divider />
          
          <List sx={{ p: 0 }}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ListItem 
                  button 
                  key={user.id}
                  selected={selectedUser?.id === user.id}
                  onClick={() => handleSelectUser(user)}
                  sx={{
                    borderBottom: '1px solid',
                    borderBottomColor: 'divider',
                    transition: 'all 0.2s',
                    '&.Mui-selected': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    },
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                >
                  <ListItemAvatar>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant={user.online ? "dot" : "standard"}
                    >
                      <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.main }}>
                        {userNames[user.id] && userNames[user.id][0] ? userNames[user.id][0].toUpperCase() : 'U'}
                      </Avatar>
                    </StyledBadge>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" fontWeight={500}>
                        {userNames[user.id] || `User ${user.id}`}
                      </Typography>
                    }
                    secondary={
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '180px'
                        }}
                      >
                        {user.lastMessage || 'Không có tin nhắn'}
                      </Typography>
                    }
                  />
                  {user.unreadCount > 0 && (
                    <Badge 
                      badgeContent={user.unreadCount} 
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText 
                  primary="Không tìm thấy người dùng" 
                  secondary="Thử tìm kiếm với từ khóa khác"
                />
              </ListItem>
            )}
          </List>
        </UserList>
        
        {/* Chat Area */}
        <ChatArea elevation={0}>
          {selectedUser ? (
            <>
              <ChatHeader>
                <Avatar sx={{ bgcolor: (theme) => theme.palette.primary.main }}>
                  {userNames[selectedUser.id] && userNames[selectedUser.id][0] ? userNames[selectedUser.id][0].toUpperCase() : 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6">{userNames[selectedUser.id]}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedUser.online ? 'Đang hoạt động' : 'Không hoạt động'}
                  </Typography>
                </Box>
              </ChatHeader>
              
              <MessageList>
                {messages.length > 0 ? (
                  messages.map((message, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      flexDirection: 'row',
                      justifyContent: message.role === 'ADMIN' || message.senderId === 'admin' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}>
                      {(message.role !== 'ADMIN' && message.senderId !== 'admin') && (
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            bgcolor: (theme) => theme.palette.primary.main,
                            fontSize: '0.8rem'
                          }}
                        >
                          {userNames[selectedUser.id] && userNames[selectedUser.id][0] ? userNames[selectedUser.id][0].toUpperCase() : 'U'}
                        </Avatar>
                      )}
                      
                      <Box sx={{ maxWidth: '70%' }}>
                        <MessageBubble 
                          isAdmin={message.role === 'ADMIN' || message.senderId === 'admin'}
                        >
                          <Typography variant="body1">
                            {message.content}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              textAlign: (message.role === 'ADMIN' || message.senderId === 'admin') ? 'right' : 'left',
                              mt: 0.5,
                              opacity: 0.6,
                              fontSize: '0.65rem'
                            }}
                          >
                            {formatMessageTime(message.timestamp)}
                          </Typography>
                        </MessageBubble>
                      </Box>
                      
                      {/* Bỏ avatar của admin đi, người nhận đã có avatar ở trên */}
                    </Box>
                  ))
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <Typography color="text.secondary">
                      Không có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                    </Typography>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </MessageList>
              
              <MessageInputArea>
                <TextField
                  fullWidth
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '24px',
                    }
                  }}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  sx={{ 
                    p: 1.5,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </MessageInputArea>
            </>
          ) : (
            <NoConversation>
              <ChatIcon sx={{ fontSize: 80, opacity: 0.3 }} />
              <Typography variant="h6">Chọn một cuộc trò chuyện</Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                Chọn một người dùng từ danh sách bên trái để bắt đầu trò chuyện
              </Typography>
            </NoConversation>
          )}
        </ChatArea>
      </ChatContainer>
    </Box>
  );
};

export default ChatInterface; 
