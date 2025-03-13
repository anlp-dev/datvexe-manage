import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Tooltip,
  Container,
  Snackbar,
  Alert,
  Divider,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  DirectionsBus as BusIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  AutoFixHigh as GenerateIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import {
  notifyError,
  notifySuccess,
} from "../../components/notification/ToastNotification.jsx";
import apiConfig from "../../configs/apiConfig.jsx";
import BusScheduleService from "../../services/BusScheduleService.jsx";
import Loading from "../../components/loading/Loading.jsx";

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  overflow: "hidden",

  marginTop: theme.spacing(8),
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

// Add new status options
const STATUS_OPTIONS = {
  scheduled: { text: 'Đã lên lịch', color: 'info', next: 'departed' },
  departed: { text: 'Đã khởi hành', color: 'warning', next: 'arrived' },
  arrived: { text: 'Đã đến nơi', color: 'success', next: null },
  cancelled: { text: 'Đã hủy', color: 'error', next: null },
};

function BusManagementDashboard() {
  const [buses, setBuses] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    route: "Hà Nội ↔ Lào Cai",
    departureTime: "",
    arrivalTime: "",
    price: "",
    busType: "",
    schedule: "",
    status: "Chờ",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Thêm state cho dialog generate
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generateDate, setGenerateDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log(generateDate, "generateDate");

  // Fetch buses data
  const fetchBuses = async () => {
    try {
      setIsLoading(true);
      const response = await BusScheduleService.getBusScheduleNow();
      if (response.status === 200) {
        setBuses(response.data);
      }
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSelectedBus(null);
  };

  const handleConfirmClose = () => setConfirmOpen(false);

  const handleEdit = (bus) => {
    setSelectedBus(bus);
    setFormData({ ...bus });
    setIsEditing(true);
    setOpen(true);
  };

  const confirmDelete = () => {
    setBuses(buses.filter((bus) => bus._id !== deleteId));
    setConfirmOpen(false);
    showSnackbar("Đã xóa chuyến xe thành công!", "success");
  };

  // Hàm mở dialog generate
  const handleOpenGenerateDialog = () => {
    setGenerateDialogOpen(true);
    setGenerateDate(new Date().toISOString().split("T")[0]); // Set ngày hiện tại
  };

  const handleCloseGenerateDialog = () => {
    setGenerateDialogOpen(false);
  };

  const handleGenerateTrips = async () => {
    try {
      const dataReq = {
        dateReq: generateDate,
      };
      const response = await BusScheduleService.generateBusSchedule(dataReq);
      if(response.status === 200){
        notifySuccess(response.message);
        fetchBuses();
        setGenerateDialogOpen(false);
      }else{
        notifyError(response.message);
        fetchBuses();
        setGenerateDialogOpen(false);
      }
    } catch (e) {
      notifyError(e.message);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    return STATUS_OPTIONS[status]?.text || status;
  };

  const getStatusColor = (status) => {
    return STATUS_OPTIONS[status]?.color || 'default';
  };

  const handleStatusChange = async (bus, forceStatus = null) => {
    try {
      const nextStatus = forceStatus || STATUS_OPTIONS[bus.status]?.next;
      if (!nextStatus) return;

      const response = await BusScheduleService.updateBusScheduleStatus(bus._id, { status: nextStatus });
      if (response.status === 200) {
        await fetchBuses(); // Refresh data
        notifySuccess('Cập nhật trạng thái thành công!');
      }
    } catch (error) {
      notifyError(error.message);
    }
  };

  // Get next status button text
  const getNextStatusText = (currentStatus) => {
    const nextStatus = STATUS_OPTIONS[currentStatus]?.next;
    return nextStatus ? STATUS_OPTIONS[nextStatus].text : null;
  };

  // Get button color based on next status
  const getNextStatusColor = (currentStatus) => {
    const nextStatus = STATUS_OPTIONS[currentStatus]?.next;
    switch (nextStatus) {
      case 'departed':
        return 'primary';
      case 'arrived':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'inherit';
    }
  };

  return (
    <Container maxWidth={false}>
      {isLoading ? (<Loading/>) : ""}
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
          Quản lý Chuyến xe
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard bgcolor="#3f51b5">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                Tổng số chuyến
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {buses.length}
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
              <BusIcon fontSize="large" />
            </Avatar>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard bgcolor="#f50057">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                Chuyến đang chạy
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {buses.filter((bus) => bus.status === "in_progress").length}
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
              <ScheduleIcon fontSize="large" />
            </Avatar>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard bgcolor="#00bcd4">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                Tổng doanh thu
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {buses.reduce((sum, bus) => sum + bus.price, 0).toLocaleString()} đ
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
              <MoneyIcon fontSize="large" />
            </Avatar>
          </StatsCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard bgcolor="#4caf50">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                Chuyến hoàn thành
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {buses.filter((bus) => bus.status === "completed").length}
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
              <BusIcon fontSize="large" />
            </Avatar>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Bus Management Table */}
      <StyledCard>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Danh sách chuyến xe ngày {new Date().toLocaleDateString('vi-VN')}
            </Typography>
          }
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <ActionButton
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchBuses}
              >
                Làm mới
              </ActionButton>
              <ActionButton
                variant="contained"
                color="secondary"
                startIcon={<GenerateIcon />}
                onClick={handleOpenGenerateDialog}
              >
                Tạo chuyến
              </ActionButton>
            </Box>
          }
          sx={{ px: 3, py: 2.5 }}
        />
        <Divider />
        <CardContent sx={{ p: 3 }}>
          {/* Search Bar */}
          {/* <Box sx={{ display: "flex", mb: 4 }}>
            <SearchField
              size="small"
              placeholder="Tìm kiếm chuyến xe..."
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
          </Box> */}

          {/* Bus Table */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              mb: 2,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                  <TableCell sx={{ fontWeight: 600 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mã chuyến</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Nhà xe</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tuyến</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Thời gian</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Giá vé</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Loại xe</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ghế trống</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buses.map((bus, index) => (
                  <TableRow
                    key={bus._id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha("#3f51b5", 0.04),
                      },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{bus.tripCode}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            mr: 2,
                            bgcolor: bus.status === "in_progress"
                              ? "#f50057"
                              : bus.status === "completed"
                              ? "#4caf50"
                              : bus.status === "scheduled"
                              ? "#2196f3"
                              : "#9e9e9e",
                          }}
                        >
                          <BusIcon />
                        </Avatar>
                        <Box>
                          <Typography fontWeight={500}>
                            {bus.busOperator.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {bus.busOperator.bienSoXe}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography>{bus.route}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {bus.benXeKhoiHanh.tenBenXe} → {bus.benXeDichDen.tenBenXe}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography>{formatDateTime(bus.timeStart)}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {bus.timeRoute} giờ
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{bus.price.toLocaleString()} đ</TableCell>
                    <TableCell>
                      <Chip
                        label={bus.busOperator.types.name}
                        size="small"
                        color="primary"
                        sx={{ borderRadius: "12px" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography color={bus.availableSeats < 5 ? "error" : "inherit"}>
                        {bus.availableSeats}/{bus.busOperator.types.seats}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(bus.status)}
                        size="small"
                        color={getStatusColor(bus.status)}
                        sx={{ borderRadius: "12px" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(bus)}
                            sx={{
                              color: "primary.main",
                              bgcolor: alpha("#3f51b5", 0.1),
                              "&:hover": {
                                bgcolor: alpha("#3f51b5", 0.2),
                              },
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {STATUS_OPTIONS[bus.status]?.next && (
                          <Tooltip title={`Chuyển sang ${getNextStatusText(bus.status)}`}>
                            <IconButton
                              size="small"
                              onClick={() => handleStatusChange(bus)}
                              sx={{
                                color: getNextStatusColor(bus.status) + ".main",
                                bgcolor: alpha(getNextStatusColor(bus.status) === 'primary' ? '#3f51b5' : 
                                         getNextStatusColor(bus.status) === 'success' ? '#4caf50' :
                                         '#f44336', 0.1),
                                "&:hover": {
                                  bgcolor: alpha(getNextStatusColor(bus.status) === 'primary' ? '#3f51b5' : 
                                          getNextStatusColor(bus.status) === 'success' ? '#4caf50' :
                                          '#f44336', 0.2),
                                },
                              }}
                            >
                              <TrendingUpIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {bus.status !== 'cancelled' && bus.status !== 'arrived' && (
                          <Tooltip title="Hủy chuyến">
                            <IconButton
                              size="small"
                              onClick={() => handleStatusChange(bus, 'cancelled')}
                              sx={{
                                color: "error.main",
                                bgcolor: alpha("#f44336", 0.1),
                                "&:hover": {
                                  bgcolor: alpha("#f44336", 0.2),
                                },
                              }}
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </StyledCard>

      {/* View Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết chuyến xe</DialogTitle>
        <Divider />
        <DialogContent>
          {selectedBus && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Thông tin chuyến xe
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mã chuyến
                </Typography>
                <Typography variant="body1">{selectedBus.tripCode}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nhà xe
                </Typography>
                <Typography variant="body1">{selectedBus.busOperator.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tuyến đường
                </Typography>
                <Typography variant="body1">{selectedBus.route}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Thời gian di chuyển
                </Typography>
                <Typography variant="body1">{selectedBus.timeRoute} giờ</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Điểm khởi hành
                </Typography>
                <Typography variant="body1">{selectedBus.benXeKhoiHanh.tenBenXe}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Điểm đến
                </Typography>
                <Typography variant="body1">{selectedBus.benXeDichDen.tenBenXe}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Thời gian khởi hành
                </Typography>
                <Typography variant="body1">{formatDateTime(selectedBus.timeStart)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Thời gian đến
                </Typography>
                <Typography variant="body1">{formatDateTime(selectedBus.timeEnd)}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Giá vé
                </Typography>
                <Typography variant="body1">{selectedBus.price.toLocaleString()} đ</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Số ghế trống
                </Typography>
                <Typography variant="body1">
                  {selectedBus.availableSeats}/{selectedBus.busOperator.types.seats}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Thông tin xe
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Loại xe
                </Typography>
                <Typography variant="body1">{selectedBus.busOperator.types.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Biển số
                </Typography>
                <Typography variant="body1">{selectedBus.busOperator.bienSoXe}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Model
                </Typography>
                <Typography variant="body1">{selectedBus.busOperator.types.model}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tiện ích
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {selectedBus.busOperator.types.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xác nhận xóa */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Xác nhận xóa chuyến xe</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa chuyến xe này? Hành động này không thể
            hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleConfirmClose}
            variant="outlined"
            color="inherit"
          >
            Hủy
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Generate Trip */}
      <Dialog
        open={generateDialogOpen}
        onClose={handleCloseGenerateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tạo chuyến xe theo ngày</DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom>
              Chọn ngày để tạo các chuyến xe tự động. Hệ thống sẽ tạo chuyến dựa
              trên lịch trình định sẵn.
            </Typography>
            <TextField
              label="Chọn ngày"
              type="date"
              value={generateDate}
              onChange={(e) => setGenerateDate(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseGenerateDialog}
            variant="outlined"
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            onClick={handleGenerateTrips}
            variant="contained"
            color="secondary"
            startIcon={<GenerateIcon />}
          >
            Tạo chuyến
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default BusManagementDashboard;

