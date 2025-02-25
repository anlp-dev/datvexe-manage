import React, { useState } from 'react';
import {
    Typography,
    Container,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Chip,
    Box,
    Grid,
    Divider,
    Tooltip,
    alpha
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    PeopleAlt as PeopleAltIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
    overflow: 'hidden',
    borderRadius: theme.spacing(2),
    width: "100%",
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    }
}));

const StatsCard = styled(Paper)(({ theme, bgcolor }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    backgroundColor: bgcolor,
    color: '#fff',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '30%',
        height: '100%',
        backgroundColor: alpha('#fff', 0.1),
        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
    }
}));

const SearchField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(3),
        backgroundColor: alpha(theme.palette.common.white, 0.9),
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.3s',
        '&:hover': {
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        },
        '&.Mui-focused': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }
    }
}));

const StyledAvatar = styled(Avatar)(({ theme, color }) => ({
    backgroundColor: color || theme.palette.primary.main,
    fontWeight: 'bold',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)',
    }
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(3),
    padding: '8px 16px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    transition: 'all 0.3s',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(0,0,0,0.15)',
    }
}));

// Reduced sample user data
const initialUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Admin',
        status: 'Active',
        lastLogin: '2023-05-15',
        avatar: 'J'
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'User',
        status: 'Active',
        lastLogin: '2023-05-20',
        avatar: 'J'
    },
    {
        id: 3,
        name: 'Robert Johnson',
        email: 'robert.johnson@example.com',
        role: 'Editor',
        status: 'Inactive',
        lastLogin: '2023-04-30',
        avatar: 'R'
    },
    {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'User',
        status: 'Active',
        lastLogin: '2023-05-21',
        avatar: 'E'
    }
];

// Basic statistics
const statistics = {
    totalUsers: 432,
    activeUsers: 389,
    newUsersToday: 8
};

const UserManagement = () => {
    const [users, setUsers] = useState(initialUsers);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtered users
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle search input
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    // Get avatar color based on status
    const getAvatarColor = (status, role) => {
        if (status === 'Inactive') return '#9e9e9e';
        if (role === 'Admin') return '#3f51b5';
        if (role === 'Editor') return '#9c27b0';
        return '#2196f3';
    };

    // Render status chip with appropriate color
    const renderStatusChip = (status) => {
        let color = 'default';
        let icon = null;

        switch (status) {
            case 'Active':
                color = 'success';
                icon = <CheckCircleIcon fontSize="small" />;
                break;
            case 'Inactive':
                color = 'default';
                break;
            default:
                color = 'default';
        }

        return (
            <Chip
                label={status}
                color={color}
                size="small"
                icon={icon}
                sx={{
                    borderRadius: '12px',
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1 }
                }}
            />
        );
    };

    // Render role chip with appropriate color
    const renderRoleChip = (role) => {
        let color = 'default';

        switch (role) {
            case 'Admin':
                color = 'primary';
                break;
            case 'Editor':
                color = 'secondary';
                break;
            case 'User':
                color = 'info';
                break;
            default:
                color = 'default';
        }

        return (
            <Chip
                label={role}
                color={color}
                size="small"
                sx={{
                    borderRadius: '12px',
                    fontWeight: 500,
                    '& .MuiChip-label': { px: 1 }
                }}
            />
        );
    };

    return (
        <Container maxWidth={100}>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Quản lý người dùng
                </Typography>
            </Box>

            {/* Enhanced Statistics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <StatsCard bgcolor="#3f51b5">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                                Tổng số người dùng
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                {statistics.totalUsers}
                            </Typography>
                        </Box>
                        <Avatar
                            sx={{
                                bgcolor: alpha('#fff', 0.2),
                                width: 56,
                                height: 56,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                        >
                            <PeopleAltIcon fontSize="large" />
                        </Avatar>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard bgcolor="#4caf50">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                                Người dùng đang hoạt động
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                {statistics.activeUsers}
                            </Typography>
                        </Box>
                        <Avatar
                            sx={{
                                bgcolor: alpha('#fff', 0.2),
                                width: 56,
                                height: 56,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                        >
                            <PersonIcon fontSize="large" />
                        </Avatar>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard bgcolor="#ff9800">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                                Người dùng mới hôm nay
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                {statistics.newUsersToday}
                            </Typography>
                        </Box>
                        <Avatar
                            sx={{
                                bgcolor: alpha('#fff', 0.2),
                                width: 56,
                                height: 56,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}
                        >
                            <PersonIcon fontSize="large" />
                        </Avatar>
                    </StatsCard>
                </Grid>
            </Grid>

            {/* Enhanced User Management Table */}
            <StyledCard sx={{ mt: 10 }}>
                <CardHeader
                    title={
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Danh sách người dùng
                        </Typography>
                    }
                    action={
                        <ActionButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            color="primary"
                        >
                            Thêm người dùng
                        </ActionButton>
                    }
                    sx={{ px: 3, py: 2.5 }}
                />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                    {/* Enhanced Search Bar */}
                    <Box sx={{ display: 'flex', mb: 4 }}>
                        <SearchField
                            size="small"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                                ),
                            }}
                            fullWidth
                            sx={{ mr: 2, maxWidth: 300 }}
                        />
                        <Button
                            startIcon={<FilterListIcon />}
                            variant="outlined"
                            sx={{
                                borderRadius: 3,
                                px: 2,
                                borderWidth: 1.5
                            }}
                        >
                            Lọc
                        </Button>
                    </Box>

                    {/* Enhanced Users Table */}
                    <TableContainer component={Paper} elevation={0} sx={{
                        borderRadius: 2,
                        border: '1px solid rgba(0,0,0,0.08)',
                        mb: 2,
                        width: "100%"
                    }}>
                        <Table size="medium">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Tên người dùng</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Vai trò</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Đăng nhập cuối</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user) => (
                                        <TableRow
                                            key={user.id}
                                            hover
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: alpha('#3f51b5', 0.04)
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <StyledAvatar
                                                        sx={{ mr: 2 }}
                                                        color={getAvatarColor(user.status, user.role)}
                                                    >
                                                        {user.avatar}
                                                    </StyledAvatar>
                                                    <Typography fontWeight={500}>{user.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{renderRoleChip(user.role)}</TableCell>
                                            <TableCell>{renderStatusChip(user.status)}</TableCell>
                                            <TableCell>{user.lastLogin}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            mr: 1,
                                                            color: 'primary.main',
                                                            bgcolor: alpha('#3f51b5', 0.1),
                                                            '&:hover': {
                                                                bgcolor: alpha('#3f51b5', 0.2),
                                                            }
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            color: 'error.main',
                                                            bgcolor: alpha('#f44336', 0.1),
                                                            '&:hover': {
                                                                bgcolor: alpha('#f44336', 0.2),
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {filteredUsers.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <PeopleAltIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                                <Typography variant="subtitle1" color="text.secondary">
                                                    Không tìm thấy người dùng nào
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Người dùng mỗi trang:"
                        sx={{
                            '.MuiTablePagination-select': {
                                borderRadius: 2,
                                mr: 1
                            }
                        }}
                    />
                </CardContent>
            </StyledCard>
        </Container>
    );
};

export default UserManagement;