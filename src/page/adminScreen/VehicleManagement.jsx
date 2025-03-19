import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsBus as BusIcon,
  EventSeat as SeatIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  BusAlert as BusAlertIcon,
  HandymanOutlined as MaintenanceIcon,
  DoNotDisturbOn as StopIcon,
} from "@mui/icons-material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import BusOperatorService from "../../services/BusOperatorService.jsx";
import { notifySuccess } from "../../components/notification/ToastNotification.jsx";
import Loading from "../../components/loading/Loading";

// Map status boolean to readable status
const mapStatus = (status) => {
  if (status === true) return "Đang hoạt động";
  if (status === false) return "Dừng chạy";
  return "Bảo trì";
};

// Mapping trạng thái sang màu sắc
const statusColors = {
  "Đang hoạt động": "success",
  "Bảo trì": "warning",
  "Dừng chạy": "error",
};

const statusIcons = {
  "Đang hoạt động": <BusIcon />,
  "Bảo trì": <MaintenanceIcon />,
  "Dừng chạy": <StopIcon />,
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
  },
}));

const StatCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
  borderRadius: theme.spacing(2),
  backgroundColor: color,
  color: "#fff",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
  },
}));

const StatusAvatar = styled(Avatar)(({ theme, status }) => {
  const colors = {
    "Đang hoạt động": theme.palette.success.main,
    "Bảo trì": theme.palette.warning.main,
    "Dừng chạy": theme.palette.error.main,
  };

  return {
    backgroundColor: colors[status] || theme.palette.grey[500],
  };
});

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({
    _id: null,
    name: "",
    types: {
      name: "",
      code: "BUS34",
      seats: 34,
      features: [],
      model: "",
    },
    bienSoXe: "",
    phone: "",
    status: true,
    description: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [tabValue, setTabValue] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [seatDialogOpen, setSeatDialogOpen] = useState(false);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await BusOperatorService.getAllBuses();
      if (response.status === 200) {
        setVehicles(response.data);
      } else {
        notifyError(response.message);
      }
      setLoading(false);
    } catch (err) {
      setError("Không thể tải dữ liệu xe. Vui lòng thử lại sau.");
      setLoading(false);
      console.error("Error fetching bus data:", err);
    }
  };

  // Stats for pie chart
  const statusStats = [
    {
      name: "Đang hoạt động",
      value: vehicles.filter((v) => v.status === true).length,
    },
    {
      name: "Bảo trì",
      value: vehicles.filter((v) => v.status === null).length,
    },
    {
      name: "Dừng chạy",
      value: vehicles.filter((v) => v.status === false).length,
    },
  ];

  const COLORS = ["#4caf50", "#ff9800", "#f44336"];

  // Functions
  const handleOpen = (vehicle = null) => {
    if (vehicle) {
      setCurrentVehicle({ ...vehicle });
    } else {
      setCurrentVehicle({
        _id: null,
        name: "",
        types: {
          name: "",
          code: "BUS34",
          seats: 34,
          features: [],
          model: "",
        },
        bienSoXe: "",
        phone: "",
        status: true,
        description: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      let response;
      if (currentVehicle._id) {
        // Update existing bus
        response = await BusOperatorService.updateBus(
          currentVehicle._id,
          currentVehicle
        );
        if (response.error) {
          console.error("Error updating bus:", response.message);
          // You could show an error message to the user here
          return;
        }
        const updatedVehicles = vehicles.map((vehicle) =>
          vehicle._id === currentVehicle._id ? currentVehicle : vehicle
        );
        setVehicles(updatedVehicles);
      } else {
        // Create new bus
        response = await BusOperatorService.createBus(currentVehicle);
        if (response.error) {
          console.error("Error creating bus:", response.message);
          // You could show an error message to the user here
          return;
        }
        setVehicles([...vehicles, response]);
      }
      handleClose();
    } catch (err) {
      console.error("Error saving bus:", err);
      // You might want to show an error message to the user
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await BusOperatorService.deleteBus(id);
      if (response.error) {
        console.error("Error deleting bus:", response.message);
        // You could show an error message to the user here
        return;
      }
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
    } catch (err) {
      console.error("Error deleting bus:", err);
      // You might want to show an error message to the user
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("types.")) {
      const typeProp = name.split(".")[1];
      setCurrentVehicle({
        ...currentVehicle,
        types: {
          ...currentVehicle.types,
          [typeProp]: value,
        },
      });
    } else if (name === "status") {
      // Convert string value to boolean
      const boolValue = value === "true";
      setCurrentVehicle({ ...currentVehicle, [name]: boolValue });
    } else {
      setCurrentVehicle({ ...currentVehicle, [name]: value });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const handleShowSeats = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSeatDialogOpen(true);
  };

  // Seat Layout Component
  const SeatLayout = ({ vehicle }) => {
    const rows = vehicle.type === "BUS34" ? 9 : 5;
    const seatsPerRow = 4;

    return (
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={1} justifyContent="center">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <Grid item xs={12} key={rowIndex}>
              <Grid container spacing={1} justifyContent="center">
                {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
                  const seatNumber = rowIndex * seatsPerRow + seatIndex + 1;
                  if (seatNumber > vehicle.seats) return null;

                  return (
                    <Grid item key={seatIndex}>
                      <Paper
                        sx={{
                          p: 1,
                          width: 40,
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          bgcolor: "primary.main",
                          color: "white",
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        {seatNumber}
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      {loading && (
        <Loading fullScreen={true} />
      )}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <BusIcon sx={{ mr: 1, color: "#3f51b5" }} /> Quản lý Xe & Sơ đồ ghế
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard color="#3f51b5">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Tổng số xe
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {vehicles.length}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
                <Typography variant="caption">
                  {vehicles.length} xe trong hệ thống
                </Typography>
              </Box>
            </Box>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
            >
              <BusIcon />
            </Avatar>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard color="#4caf50">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Đang hoạt động
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {vehicles.filter((v) => v.status === true).length}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
                <Typography variant="caption">
                  {Math.round(
                    (vehicles.filter((v) => v.status === true).length /
                      vehicles.length) *
                      100
                  )}
                  % xe đang hoạt động
                </Typography>
              </Box>
            </Box>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
            >
              <BusIcon />
            </Avatar>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard color="#ff9800">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Không hoạt động
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {vehicles.filter((v) => v.status === false).length}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingDownIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
                <Typography variant="caption">
                  {Math.round(
                    (vehicles.filter((v) => v.status === false).length /
                      vehicles.length) *
                      100
                  )}
                  % xe không hoạt động
                </Typography>
              </Box>
            </Box>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
            >
              <StopIcon />
            </Avatar>
          </StatCard>
        </Grid>
      </Grid>

      <StyledCard>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Danh sách xe" />
          <Tab label="Thống kê & Báo cáo" />
        </Tabs>

        {/* Danh sách xe */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                sx={{ borderRadius: 2 }}
              >
                Thêm xe mới
              </Button>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="danh sách xe">
                <TableHead sx={{ bgcolor: "primary.light" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      STT
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Tên xe
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Biển số xe
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Loại xe
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Số ghế
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Số điện thoại
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Đánh giá
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "white", fontWeight: "bold" }}
                    >
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((vehicle, index) => (
                      <TableRow
                        key={vehicle._id}
                        hover
                        sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02)" } }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{vehicle.name}</TableCell>
                        <TableCell>{vehicle.bienSoXe}</TableCell>
                        <TableCell>{vehicle.types?.code || "-"}</TableCell>
                        <TableCell>{vehicle.types?.seats || "-"}</TableCell>
                        <TableCell>{vehicle.phone}</TableCell>
                        <TableCell>
                          <Chip
                            label={mapStatus(vehicle.status)}
                            color={statusColors[mapStatus(vehicle.status)]}
                            size="small"
                            icon={statusIcons[mapStatus(vehicle.status)]}
                            sx={{ fontWeight: "bold" }}
                          />
                        </TableCell>
                        <TableCell>
                          {vehicle.rating ? `${vehicle.rating}/5` : "Chưa có"}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Xem sơ đồ ghế">
                            <IconButton
                              color="primary"
                              onClick={() => handleShowSeats(vehicle)}
                            >
                              <SeatIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpen(vehicle)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(vehicle._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={vehicles.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng mỗi trang:"
              />
            </TableContainer>
          </Box>
        )}

        {/* Thống kê & Báo cáo */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <StyledCard>
                  <CardHeader
                    title="Thống kê trạng thái xe"
                    subheader="Thông tin các trạng thái hoạt động của xe"
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />
                  <CardContent sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {statusStats.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledCard>
                  <CardHeader
                    title="Danh sách xe ngừng hoạt động"
                    subheader="Các xe đang trong trạng thái không hoạt động"
                  />
                  <CardContent sx={{ px: 0 }}>
                    <List>
                      {vehicles
                        .filter((v) => v.status === false)
                        .map((vehicle, index, array) => (
                          <React.Fragment key={vehicle._id}>
                            <ListItem>
                              <ListItemAvatar>
                                <StatusAvatar
                                  status={mapStatus(vehicle.status)}
                                >
                                  <StopIcon />
                                </StatusAvatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={vehicle.name}
                                secondary={`Biển số: ${vehicle.bienSoXe}`}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  vehicle.createdAt
                                ).toLocaleDateString()}
                              </Typography>
                            </ListItem>
                            {index < array.length - 1 && (
                              <Divider variant="inset" component="li" />
                            )}
                          </React.Fragment>
                        ))}

                      {vehicles.filter((v) => v.status === false).length ===
                        0 && (
                        <ListItem>
                          <ListItemText primary="Không có xe ngừng hoạt động" />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </StyledCard>
              </Grid>
            </Grid>
          </Box>
        )}
      </StyledCard>

      {/* Dialog thêm/sửa xe */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentVehicle._id ? "Chỉnh sửa thông tin xe" : "Thêm xe mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Tên xe"
              fullWidth
              margin="normal"
              value={currentVehicle.name}
              onChange={handleChange}
            />
            <TextField
              name="bienSoXe"
              label="Biển số xe"
              fullWidth
              margin="normal"
              value={currentVehicle.bienSoXe}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Loại xe</InputLabel>
              <Select
                name="types.code"
                value={currentVehicle.types?.code || ""}
                onChange={handleChange}
                label="Loại xe"
              >
                <MenuItem value="BUS34">BUS34</MenuItem>
                <MenuItem value="BUS20">BUS20</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="phone"
              label="Số điện thoại liên hệ"
              fullWidth
              margin="normal"
              value={currentVehicle.phone}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={String(currentVehicle.status)}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value="true">Đang hoạt động</MenuItem>
                <MenuItem value="false">Dừng chạy</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="description"
              label="Mô tả"
              fullWidth
              margin="normal"
              value={currentVehicle.description || ""}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog hiển thị sơ đồ ghế */}
      <Dialog
        open={seatDialogOpen}
        onClose={() => setSeatDialogOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>
          Sơ đồ ghế - {selectedVehicle?.name} ({selectedVehicle?.bienSoXe})
        </DialogTitle>
        <DialogContent>
          {selectedVehicle && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Loại xe: {selectedVehicle.types?.name} (
                  {selectedVehicle.types?.code})
                </Typography>
                <Typography variant="subtitle1">
                  Số ghế: {selectedVehicle.types?.seats}
                </Typography>
                {selectedVehicle.types?.features &&
                  selectedVehicle.types.features.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle1">Tiện ích:</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {selectedVehicle.types.features.map(
                          (feature, index) => (
                            <Chip key={index} label={feature} size="small" />
                          )
                        )}
                      </Box>
                    </Box>
                  )}
              </Box>
              <SeatLayout
                vehicle={{
                  ...selectedVehicle,
                  type: selectedVehicle.types?.code,
                  seats: selectedVehicle.types?.seats,
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSeatDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VehicleManagement;
