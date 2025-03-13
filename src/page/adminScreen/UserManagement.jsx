import React, { useState, useEffect } from "react";
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
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  PeopleAlt as PeopleAltIcon,
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  notifySuccess,
  notifyError,
} from "../../components/notification/ToastNotification.jsx";
import UserService from "../../services/UserService";
import UserDialog from "../../components/dialog/UserDialog";
import moment from "moment";
import Loading from "../../components/loading/Loading";
import AdminService from "../../services/AdminService.jsx";

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  overflow: "hidden",
  marginTop: 60,
  borderRadius: theme.spacing(2),
  width: "100%",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  },
}));

const StatsCard = styled(Paper)(({ theme, bgcolor }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: bgcolor,
  color: "#fff",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "30%",
    height: "100%",
    backgroundColor: alpha("#fff", 0.1),
    clipPath: "polygon(100% 0, 0 0, 100% 100%)",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(3),
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
    },
  },
}));

const StyledAvatar = styled(Avatar)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  fontWeight: "bold",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: "8px 16px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
  },
}));

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await UserService.getAllUsers();
      if (response.status === 200) {
        setUsers(response.data);
        fetchRoles();
        filterDataStatistics();
      }
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDataStatistics = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === "01").length;
    const newUsersToday = users.filter((user) => moment(user.createdAt).isSame(moment(), "day")).length;
    setStatistics({ totalUsers, activeUsers, newUsersToday });
  }

  const fetchRoles = async () => {
    try {
      const response = await AdminService.getRole();
      if (response.status === 200) {
        setRoleData(response.data);
      }
    } catch (e) {
      notifyError(e.message);
    }
  };

  const handleOpenDialog = (user = null) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setOpenDialog(false);
  };

  const handleSaveUser = async (userData) => {
    try {
      setIsLoading(true);
      console.log(userData)
      const response = selectedUser
        ? await UserService.updateUser(userData)
        : await UserService.createUser(userData);

      if (response.status === 200) {
        notifySuccess(response.message);
        fetchUsers();
        handleCloseDialog();
      }
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await UserService.deleteUser(userToDelete.id);
      if (response.status === 200) {
        notifySuccess(response.message);
        fetchUsers();
      }
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
      setOpenDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  // Filtered users
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Render status chip with appropriate color
  const renderStatusChip = (status) => {
    const isActive = status === "01";
    return (
      <Chip
        label={isActive ? "Hoạt động" : "Không hoạt động"}
        color={isActive ? "success" : "default"}
        size="small"
        icon={
          isActive ? (
            <CheckCircleIcon fontSize="small" />
          ) : (
            <BlockIcon fontSize="small" />
          )
        }
        sx={{
          borderRadius: "12px",
          fontWeight: 500,
          "& .MuiChip-label": { px: 1 },
        }}
      />
    );
  };

  // Render role chip with appropriate color
  const renderRoleChip = (role, color) => {
    const findRole = roleData.find((r) => r.code === role);

    return (
      <Chip
        label={findRole?.name}
        size="small"
        sx={{
          borderRadius: "12px",
          fontWeight: 500,
          backgroundColor: color || "#2196f3",
          color: "white",
          "& .MuiChip-label": { px: 1 },
        }}
      />
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quản lý người dùng
        </Typography>
      </Box>

      {/* Statistics Cards */}
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
                bgcolor: alpha("#fff", 0.2),
                width: 56,
                height: 56,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
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
                bgcolor: alpha("#fff", 0.2),
                width: 56,
                height: 56,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
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
                bgcolor: alpha("#fff", 0.2),
                width: 56,
                height: 56,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
          </StatsCard>
        </Grid>
      </Grid>

      {/* User Management Table */}
      <StyledCard>
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
              onClick={() => handleOpenDialog()}
            >
              Thêm người dùng
            </ActionButton>
          }
          sx={{ px: 3, py: 2.5 }}
        />
        <Divider />
        <CardContent sx={{ p: 3 }}>
          {/* Search Bar */}
          <Box sx={{ display: "flex", mb: 4 }}>
            <SearchField
              size="small"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
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
                borderWidth: 1.5,
              }}
            >
              Lọc
            </Button>
          </Box>

          {/* Users Table */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              mb: 2,
            }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                <TableCell sx={{ fontWeight: 300 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Thông tin người dùng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Tên đăng nhập
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Số điện thoại</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Vai trò</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Điểm tích lũy</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Đăng nhập cuối</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow
                      key={user._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#3f51b5", 0.04),
                        },
                      }}
                    >
                    <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <StyledAvatar sx={{ mr: 2 }} color={user.colorRole}>
                            {user.fullname[0]}
                          </StyledAvatar>
                          <Box>
                            <Typography fontWeight={500}>
                              {user.fullname}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        {renderRoleChip(user.role, user.colorRole)}
                      </TableCell>
                      <TableCell>{renderStatusChip(user.status)}</TableCell>
                      <TableCell>{moment(user.createdAt).format("DD/MM/YYYY HH:mm")}</TableCell>
                      <TableCell>{user.loyaltyPoints}</TableCell>
                      <TableCell>
                        {moment(user.lastLogin).format("DD/MM/YYYY HH:mm")}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(user)}
                            sx={{
                              mr: 1,
                              color: "primary.main",
                              bgcolor: alpha("#3f51b5", 0.1),
                              "&:hover": {
                                bgcolor: alpha("#3f51b5", 0.2),
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(user)}
                            sx={{
                              color: "error.main",
                              bgcolor: alpha("#f44336", 0.1),
                              "&:hover": {
                                bgcolor: alpha("#f44336", 0.2),
                              },
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
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <PeopleAltIcon
                          sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                        />
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
              ".MuiTablePagination-select": {
                borderRadius: 2,
                mr: 1,
              },
            }}
          />
        </CardContent>
      </StyledCard>

      {/* User Dialog */}
      <UserDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveUser}
        user={selectedUser}
        loading={isLoading}
        roleData={roleData}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng {userToDelete?.fullname}? Hành
            động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
