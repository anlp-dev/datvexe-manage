import React, { useState } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Grid, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputLabel, Select, MenuItem, IconButton,
    Chip, Card, CardContent, CardHeader, Avatar,
    Tooltip, Container, Snackbar, Alert, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    DirectionsBus as BusIcon,
    Schedule as ScheduleIcon,
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

// Dữ liệu mẫu
const initialBuses = [
    {
        id: 1,
        name: 'Chuyến sáng HN-LC',
        code: 'HN-LC-001',
        route: 'Hà Nội ↔ Lào Cai',
        departureTime: '07:30',
        arrivalTime: '13:30',
        price: 250000,
        busType: 'BUS34',
        schedule: 'Hằng ngày',
        status: 'Chờ'
    },
    {
        id: 2,
        name: 'Chuyến chiều HN-LC',
        code: 'HN-LC-002',
        route: 'Hà Nội ↔ Lào Cai',
        departureTime: '14:00',
        arrivalTime: '20:00',
        price: 250000,
        busType: 'BUS34',
        schedule: 'Ngày chẵn',
        status: 'Đang chạy'
    },
    {
        id: 3,
        name: 'Chuyến đêm LC-HN',
        code: 'LC-HN-001',
        route: 'Lào Cai ↔ Hà Nội',
        departureTime: '20:30',
        arrivalTime: '02:30',
        price: 280000,
        busType: 'BUS20',
        schedule: 'Hằng ngày',
        status: 'Hoàn thành'
    },
];

const busTypes = ['BUS34', 'BUS20'];
const scheduleTypes = ['Hằng ngày', 'Ngày chẵn', 'Ngày lẻ', 'Thứ 2-6', 'Cuối tuần'];
const statusOptions = ['Chờ', 'Đang chạy', 'Hoàn thành', 'Hủy'];

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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
    '& .MuiTableCell-head': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 'bold',
    },
    '& .MuiTableRow-root:hover': {
        backgroundColor: theme.palette.action.hover,
    }
}));

function BusManagementDashboard() {
    const [buses, setBuses] = useState(initialBuses);
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        route: 'Hà Nội ↔ Lào Cai',
        departureTime: '',
        arrivalTime: '',
        price: '',
        busType: '',
        schedule: '',
        status: 'Chờ'
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleClickOpen = () => {
        setOpen(true);
        setIsEditing(false);
        setFormData({
            name: '',
            code: '',
            route: 'Hà Nội ↔ Lào Cai',
            departureTime: '',
            arrivalTime: '',
            price: '',
            busType: '',
            schedule: '',
            status: 'Chờ'
        });
    };

    const handleClose = () => setOpen(false);
    const handleConfirmClose = () => setConfirmOpen(false);

    const handleEdit = (bus) => {
        setSelectedBus(bus);
        setFormData({ ...bus });
        setIsEditing(true);
        setOpen(true);
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        setBuses(buses.filter((bus) => bus.id !== deleteId));
        setConfirmOpen(false);
        showSnackbar('Đã xóa chuyến xe thành công!', 'success');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' ? Number(value) : value
        });
    };

    const handleSubmit = () => {
        if (isEditing) {
            setBuses(
                buses.map((bus) => (bus.id === selectedBus.id ? { ...formData, id: selectedBus.id } : bus))
            );
            showSnackbar('Đã cập nhật chuyến xe thành công!', 'success');
        } else {
            const newBus = {
                ...formData,
                id: buses.length > 0 ? Math.max(...buses.map((bus) => bus.id)) + 1 : 1
            };
            setBuses([...buses, newBus]);
            showSnackbar('Đã thêm chuyến xe mới thành công!', 'success');
        }
        handleClose();
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'Chờ': return 'info';
            case 'Đang chạy': return 'warning';
            case 'Hoàn thành': return 'success';
            case 'Hủy': return 'error';
            default: return 'default';
        }
    };

    // Stats calculations
    const totalBuses = buses.length;
    const activeTrips = buses.filter(bus => bus.status === 'Đang chạy').length;
    const completedTrips = buses.filter(bus => bus.status === 'Hoàn thành').length;
    const totalRevenue = buses.reduce((sum, bus) => sum + bus.price, 0);

    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
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
                    Quản lý Chuyến xe
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#3f51b5">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Tổng số chuyến
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {totalBuses}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">+2 chuyến mới</Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <BusIcon />
                        </Avatar>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#f50057">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Chuyến đang chạy
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {activeTrips}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="caption">theo lịch trình</Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <ScheduleIcon />
                        </Avatar>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#00bcd4">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Tổng doanh thu
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {totalRevenue.toLocaleString()} đ
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">+8% so với tháng trước</Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <MoneyIcon />
                        </Avatar>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#4caf50">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Chuyến hoàn thành
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {completedTrips}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="caption">đúng lịch trình</Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <BusIcon />
                        </Avatar>
                    </StatCard>
                </Grid>
            </Grid>

            <StyledCard sx={{ mb: 4 }}>
                <CardHeader
                    title="Danh sách chuyến xe"
                    subheader="Tuyến Hà Nội ↔ Lào Cai"
                    action={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={() => setBuses(initialBuses)}
                            >
                                Làm mới
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleClickOpen}
                            >
                                Thêm chuyến
                            </Button>
                        </Box>
                    }
                />
                <CardContent>
                    <StyledTableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã chuyến</TableCell>
                                    <TableCell>Tên chuyến</TableCell>
                                    <TableCell>Tuyến</TableCell>
                                    <TableCell>Khởi hành</TableCell>
                                    <TableCell>Giá vé</TableCell>
                                    <TableCell>Loại xe</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell align="center">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {buses.map((bus) => (
                                    <TableRow key={bus.id} hover>
                                        <TableCell>{bus.code}</TableCell>
                                        <TableCell>{bus.name}</TableCell>
                                        <TableCell>{bus.route}</TableCell>
                                        <TableCell>{bus.departureTime}</TableCell>
                                        <TableCell>{bus.price.toLocaleString()} đ</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={bus.busType}
                                                size="small"
                                                color={bus.busType === 'BUS34' ? 'primary' : 'secondary'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={bus.status}
                                                size="small"
                                                color={getStatusChipColor(bus.status)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Sửa">
                                                <IconButton color="primary" onClick={() => handleEdit(bus)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton color="error" onClick={() => handleDelete(bus.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                </CardContent>
            </StyledCard>

            {/* Form Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {isEditing ? 'Sửa thông tin chuyến xe' : 'Thêm chuyến xe mới'}
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="name" label="Tên chuyến" value={formData.name}
                                onChange={handleChange} fullWidth required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="code" label="Mã chuyến" value={formData.code}
                                onChange={handleChange} fullWidth required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tuyến đường</InputLabel>
                                <Select
                                    name="route" value={formData.route} label="Tuyến đường"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Hà Nội ↔ Lào Cai">Hà Nội ↔ Lào Cai</MenuItem>
                                    <MenuItem value="Lào Cai ↔ Hà Nội">Lào Cai ↔ Hà Nội</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="price" label="Giá vé" type="number" value={formData.price}
                                onChange={handleChange} fullWidth required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="departureTime" label="Giờ khởi hành" type="time"
                                value={formData.departureTime} onChange={handleChange} fullWidth required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="arrivalTime" label="Giờ đến" type="time"
                                value={formData.arrivalTime} onChange={handleChange} fullWidth required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Loại xe</InputLabel>
                                <Select
                                    name="busType" value={formData.busType} label="Loại xe"
                                    onChange={handleChange}
                                >
                                    {busTypes.map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Lịch trình</InputLabel>
                                <Select
                                    name="schedule" value={formData.schedule} label="Lịch trình"
                                    onChange={handleChange}
                                >
                                    {scheduleTypes.map((schedule) => (
                                        <MenuItem key={schedule} value={schedule}>{schedule}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    name="status" value={formData.status} label="Trạng thái"
                                    onChange={handleChange}
                                >
                                    {statusOptions.map((status) => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleClose} variant="outlined" color="inherit">Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {isEditing ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog Xác nhận xóa */}
            <Dialog open={confirmOpen} onClose={handleConfirmClose}>
                <DialogTitle>Xác nhận xóa chuyến xe</DialogTitle>
                <Divider />
                <DialogContent>
                    <Typography>
                        Bạn có chắc chắn muốn xóa chuyến xe này? Hành động này không thể hoàn tác.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleConfirmClose} variant="outlined" color="inherit">Hủy</Button>
                    <Button onClick={confirmDelete} variant="contained" color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default BusManagementDashboard;