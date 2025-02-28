import React, { useState } from 'react';
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
    Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
    DoNotDisturbOn as StopIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Mock data
const initialVehicles = [
    { id: 1, plateNumber: '29B-12345', type: 'BUS34', seats: 34, driver: 'Nguyễn Văn A', status: 'Đang hoạt động', lastUpdate: '2 giờ trước' },
    { id: 2, plateNumber: '29B-67890', type: 'BUS20', seats: 20, driver: 'Trần Văn B', status: 'Bảo trì', lastUpdate: '1 ngày trước' },
    { id: 3, plateNumber: '29B-56789', type: 'BUS34', seats: 34, driver: 'Lê Văn C', status: 'Đang hoạt động', lastUpdate: '3 giờ trước' },
    { id: 4, plateNumber: '29B-45678', type: 'BUS20', seats: 20, driver: 'Phạm Văn D', status: 'Dừng chạy', lastUpdate: '5 ngày trước' },
    { id: 5, plateNumber: '29B-23456', type: 'BUS34', seats: 34, driver: 'Hoàng Văn E', status: 'Đang hoạt động', lastUpdate: '1 giờ trước' },
    { id: 6, plateNumber: '29B-34567', type: 'BUS20', seats: 20, driver: 'Ngô Văn F', status: 'Đang hoạt động', lastUpdate: '5 giờ trước' },
    { id: 7, plateNumber: '29B-78901', type: 'BUS34', seats: 34, driver: 'Đỗ Văn G', status: 'Bảo trì', lastUpdate: '2 ngày trước' },
];

// Mapping trạng thái sang màu sắc
const statusColors = {
    'Đang hoạt động': 'success',
    'Bảo trì': 'warning',
    'Dừng chạy': 'error',
};

const statusIcons = {
    'Đang hoạt động': <BusIcon />,
    'Bảo trì': <MaintenanceIcon />,
    'Dừng chạy': <StopIcon />,
};

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    borderRadius: theme.spacing(2),
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px 0 rgba(0,0,0,0.1)',
    }
}));

const StatCard = styled(Paper)(({ theme, color }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    borderRadius: theme.spacing(2),
    backgroundColor: color,
    color: '#fff',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 25px 0 rgba(0,0,0,0.1)',
    }
}));

const StatusAvatar = styled(Avatar)(({ theme, status }) => {
    const colors = {
        'Đang hoạt động': theme.palette.success.main,
        'Bảo trì': theme.palette.warning.main,
        'Dừng chạy': theme.palette.error.main,
    };

    return {
        backgroundColor: colors[status] || theme.palette.grey[500],
    };
});

const VehicleManagement = () => {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [open, setOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState({
        id: null,
        plateNumber: '',
        type: 'BUS34',
        seats: 34,
        driver: '',
        status: 'Đang hoạt động'
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [tabValue, setTabValue] = useState(0);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [seatDialogOpen, setSeatDialogOpen] = useState(false);

    // Stats for pie chart
    const statusStats = [
        { name: 'Đang hoạt động', value: vehicles.filter(v => v.status === 'Đang hoạt động').length },
        { name: 'Bảo trì', value: vehicles.filter(v => v.status === 'Bảo trì').length },
        { name: 'Dừng chạy', value: vehicles.filter(v => v.status === 'Dừng chạy').length },
    ];

    const COLORS = ['#4caf50', '#ff9800', '#f44336'];

    // Functions
    const handleOpen = (vehicle = null) => {
        if (vehicle) {
            setCurrentVehicle({ ...vehicle });
        } else {
            setCurrentVehicle({
                id: vehicles.length + 1,
                plateNumber: '',
                type: 'BUS34',
                seats: 34,
                driver: '',
                status: 'Đang hoạt động',
                lastUpdate: 'Mới'
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSave = () => {
        if (currentVehicle.id) {
            const updatedVehicles = vehicles.map(vehicle =>
                vehicle.id === currentVehicle.id ? {...currentVehicle, lastUpdate: 'Vừa cập nhật'} : vehicle
            );
            setVehicles(updatedVehicles);
        } else {
            setVehicles([...vehicles, { ...currentVehicle, id: vehicles.length + 1, lastUpdate: 'Mới' }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'type') {
            const seats = value === 'BUS34' ? 34 : 20;
            setCurrentVehicle({ ...currentVehicle, [name]: value, seats });
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
        const rows = vehicle.type === 'BUS34' ? 9 : 5;
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
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    bgcolor: 'primary.main',
                                                    color: 'white',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',
                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                                    }
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
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    <BusIcon sx={{ mr: 1, color: '#3f51b5' }} /> Quản lý Xe & Sơ đồ ghế
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
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {vehicles.length}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">
                                    +2 xe trong tháng này
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
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
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {vehicles.filter(v => v.status === 'Đang hoạt động').length}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">
                                    +1 xe so với tuần trước
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <BusIcon />
                        </Avatar>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <StatCard color="#ff9800">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Đang bảo trì
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {vehicles.filter(v => v.status === 'Bảo trì').length}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingDownIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">
                                    -1 xe so với tuần trước
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <MaintenanceIcon />
                        </Avatar>
                    </StatCard>
                </Grid>
            </Grid>

            <StyledCard>
                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Danh sách xe" />
                    <Tab label="Thống kê & Báo cáo" />
                </Tabs>

                {/* Danh sách xe */}
                {tabValue === 0 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpen()}
                                sx={{ borderRadius: 2 }}
                            >
                                Thêm xe mới
                            </Button>
                        </Box>

                        <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="danh sách xe">
                                <TableHead sx={{ bgcolor: 'primary.light' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Biển số xe</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Loại xe</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Số ghế</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tài xế phụ trách</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cập nhật</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vehicles
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((vehicle) => (
                                            <TableRow
                                                key={vehicle.id}
                                                hover
                                                sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' } }}
                                            >
                                                <TableCell>{vehicle.plateNumber}</TableCell>
                                                <TableCell>{vehicle.type}</TableCell>
                                                <TableCell>{vehicle.seats}</TableCell>
                                                <TableCell>{vehicle.driver}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={vehicle.status}
                                                        color={statusColors[vehicle.status]}
                                                        size="small"
                                                        icon={statusIcons[vehicle.status]}
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                </TableCell>
                                                <TableCell>{vehicle.lastUpdate}</TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Xem sơ đồ ghế">
                                                        <IconButton color="primary" onClick={() => handleShowSeats(vehicle)}>
                                                            <SeatIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Chỉnh sửa">
                                                        <IconButton color="primary" onClick={() => handleOpen(vehicle)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa">
                                                        <IconButton color="error" onClick={() => handleDelete(vehicle.id)}>
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
                                                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {statusStats.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                                        title="Danh sách xe bảo trì"
                                        subheader="Các xe đang trong trạng thái bảo trì"
                                    />
                                    <CardContent sx={{ px: 0 }}>
                                        <List>
                                            {vehicles
                                                .filter(v => v.status === 'Bảo trì')
                                                .map((vehicle, index, array) => (
                                                    <React.Fragment key={vehicle.id}>
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <StatusAvatar status={vehicle.status}>
                                                                    <MaintenanceIcon />
                                                                </StatusAvatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={vehicle.plateNumber}
                                                                secondary={`Tài xế: ${vehicle.driver}`}
                                                            />
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {vehicle.lastUpdate}
                                                            </Typography>
                                                        </ListItem>
                                                        {index < array.length - 1 && <Divider variant="inset" component="li" />}
                                                    </React.Fragment>
                                                ))}
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
                    {currentVehicle.id ? 'Chỉnh sửa thông tin xe' : 'Thêm xe mới'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            name="plateNumber"
                            label="Biển số xe"
                            fullWidth
                            margin="normal"
                            value={currentVehicle.plateNumber}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Loại xe</InputLabel>
                            <Select
                                name="type"
                                value={currentVehicle.type}
                                onChange={handleChange}
                                label="Loại xe"
                            >
                                <MenuItem value="BUS34">BUS34</MenuItem>
                                <MenuItem value="BUS20">BUS20</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            name="driver"
                            label="Tài xế phụ trách"
                            fullWidth
                            margin="normal"
                            value={currentVehicle.driver}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={currentVehicle.status}
                                onChange={handleChange}
                                label="Trạng thái"
                            >
                                <MenuItem value="Đang hoạt động">Đang hoạt động</MenuItem>
                                <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                                <MenuItem value="Dừng chạy">Dừng chạy</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSave} variant="contained">Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog hiển thị sơ đồ ghế */}
            <Dialog
                open={seatDialogOpen}
                onClose={() => setSeatDialogOpen(false)}
                maxWidth="md"
            >
                <DialogTitle>
                    Sơ đồ ghế - {selectedVehicle?.plateNumber} ({selectedVehicle?.type})
                </DialogTitle>
                <DialogContent>
                    {selectedVehicle && <SeatLayout vehicle={selectedVehicle} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSeatDialogOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VehicleManagement;