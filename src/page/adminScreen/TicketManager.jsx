import React, { useState, useEffect } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Grid, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputLabel, Select, MenuItem, IconButton,
    Chip, Snackbar, Alert, Tooltip, Divider, Card, CardContent,
    OutlinedInput, InputAdornment, Container, Avatar, alpha,
    CardHeader, CircularProgress
} from '@mui/material';
import {
    FilterList as FilterIcon, Print as PrintIcon,
    Receipt as ReceiptIcon, Search as SearchIcon,
    Clear as ClearIcon, CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon, AccessTime as TimeIcon,
    LocalActivity as TicketIcon, Close as CloseIcon,
    ConfirmationNumber as TicketIcon2,
    Payment as PaymentIcon,
    EventBusy as CancelledIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import TicketService from '../../services/TicketService';
import { formatCurrency } from '../../utils/format';
import Loading from "../../components/loading/Loading.jsx";

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

// Sample data
const initialTickets = [
    {
        id: 1,
        bookingCode: 'VE-20250228-001',
        customerName: 'Nguyễn Văn A',
        phone: '0912345678',
        tripCode: 'HN-LC-001',
        tripName: 'Chuyến sáng HN-LC',
        departureTime: '2025-02-28T07:30:00',
        seats: ['A01', 'A02'],
        totalAmount: 500000,
        paymentMethod: 'Tiền mặt',
        status: 'Đã thanh toán',
        bookingDate: '2025-02-25T15:30:00'
    },
    {
        id: 2,
        bookingCode: 'VE-20250228-002',
        customerName: 'Trần Thị B',
        phone: '0987654321',
        tripCode: 'HN-LC-001',
        tripName: 'Chuyến sáng HN-LC',
        departureTime: '2025-02-28T07:30:00',
        seats: ['B03'],
        totalAmount: 250000,
        paymentMethod: 'Chuyển khoản',
        status: 'Chờ thanh toán',
        bookingDate: '2025-02-26T09:15:00'
    },
    {
        id: 3,
        bookingCode: 'VE-20250227-001',
        customerName: 'Lê Văn C',
        phone: '0976543210',
        tripCode: 'HN-LC-002',
        tripName: 'Chuyến chiều HN-LC',
        departureTime: '2025-02-27T14:00:00',
        seats: ['A05', 'A06', 'A07'],
        totalAmount: 750000,
        paymentMethod: 'Chuyển khoản',
        status: 'Hoàn thành',
        bookingDate: '2025-02-20T11:45:00'
    },
    {
        id: 4,
        bookingCode: 'VE-20250301-001',
        customerName: 'Phạm Thị D',
        phone: '0923456789',
        tripCode: 'LC-HN-001',
        tripName: 'Chuyến đêm LC-HN',
        departureTime: '2025-03-01T20:30:00',
        seats: ['B10'],
        totalAmount: 280000,
        paymentMethod: 'Tiền mặt',
        status: 'Hủy',
        bookingDate: '2025-02-27T16:20:00'
    },
    {
        id: 5,
        bookingCode: 'VE-20250301-002',
        customerName: 'Hoàng Văn E',
        phone: '0934567890',
        tripCode: 'HN-LC-001',
        tripName: 'Chuyến sáng HN-LC',
        departureTime: '2025-03-01T07:30:00',
        seats: ['C12', 'C13'],
        totalAmount: 500000,
        paymentMethod: 'Chuyển khoản',
        status: 'Đã thanh toán',
        bookingDate: '2025-02-28T10:30:00'
    }
];

// Trip options
const tripOptions = [
    { code: 'HN-LC-001', name: 'Chuyến sáng HN-LC' },
    { code: 'HN-LC-002', name: 'Chuyến chiều HN-LC' },
    { code: 'LC-HN-001', name: 'Chuyến đêm LC-HN' }
];

function TicketManagementDashboard() {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [printOpen, setPrintOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [filters, setFilters] = useState({
        startDate: null, endDate: null, status: '', trip: '', paymentMethod: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await TicketService.getAdminTickets();
            if(response.status === 200){
              const data = response.data;
              const formattedTickets = data.map(ticket => ({
                  id: ticket._id,
                  bookingCode: ticket.code,
                  customerName: ticket.user.fullname,
                  phone: ticket.user.phone,
                  tripCode: ticket.busSchedule.tripCode,
                  tripName: ticket.busSchedule.route,
                  departureTime: ticket.departureTime,
                  seats: ticket.seats,
                  totalAmount: ticket.totalPrice,
                  paymentMethod: ticket.paymentMethod,
                  status: mapStatus(ticket.status),
                  bookingDate: ticket.createdAt
              }));
              setTickets(formattedTickets);
              setFilteredTickets(formattedTickets);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setSnackbar({
                open: true,
                message: 'Có lỗi xảy ra khi tải dữ liệu',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const mapStatus = (status) => {
        switch (status) {
            case 'pending': return 'Chờ thanh toán';
            case 'payed': return 'Đã thanh toán';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Hủy';
            default: return status;
        }
    };

    useEffect(() => {
        // Apply filters whenever search term or filters change
        let result = [...tickets];

        // Search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            result = result.filter(ticket =>
                ticket.bookingCode.toLowerCase().includes(search) ||
                ticket.customerName.toLowerCase().includes(search) ||
                ticket.phone.includes(search)
            );
        }

        // Date filters
        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            startDate.setHours(0, 0, 0, 0);
            result = result.filter(ticket => new Date(ticket.departureTime) >= startDate);
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            result = result.filter(ticket => new Date(ticket.departureTime) <= endDate);
        }

        // Other filters
        if (filters.status) result = result.filter(ticket => ticket.status === filters.status);
        if (filters.trip) result = result.filter(ticket => ticket.tripCode === filters.trip);
        if (filters.paymentMethod) result = result.filter(ticket => ticket.paymentMethod === filters.paymentMethod);

        setFilteredTickets(result);
    }, [filters, searchTerm, tickets]);

    // Helper functions - Replaced with standard JavaScript formatting
    const formatDate = date => {
        const d = new Date(date);
        return d.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = date => {
        const d = new Date(date);
        return d.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusProperties = status => {
        const props = { color: 'default', icon: null };
        switch (status) {
            case 'Chờ thanh toán': props.color = 'warning'; props.icon = <TimeIcon />; break;
            case 'Đã thanh toán': props.color = 'info'; props.icon = <CheckCircleIcon />; break;
            case 'Hoàn thành': props.color = 'success'; props.icon = <CheckCircleIcon />; break;
            case 'Hủy': props.color = 'error'; props.icon = <CancelIcon />; break;
        }
        return props;
    };

    const resetFilters = () => {
        setFilters({ startDate: null, endDate: null, status: '', trip: '', paymentMethod: '' });
        setSearchTerm('');
        setFilterOpen(false);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <Container maxWidth={false}>
        {loading && (
                <Loading fullScreen={true} />
            )}
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
                    Quản lý vé xe
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <StatsCard bgcolor="#3f51b5">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                                Tổng số vé
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                {tickets.length}
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
                            <TicketIcon2 fontSize="large" />
                        </Avatar>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard bgcolor="#4caf50">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                                Vé đã thanh toán
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                {tickets.filter(t => t.status === 'Đã thanh toán' || t.status === 'Hoàn thành').length}
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
                            <PaymentIcon fontSize="large" />
                        </Avatar>
                    </StatsCard>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatsCard bgcolor="#ff9800">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                                Vé chờ thanh toán
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                {tickets.filter(t => t.status === 'Chờ thanh toán').length}
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
                            <TimeIcon fontSize="large" />
                        </Avatar>
                    </StatsCard>
                </Grid>
            </Grid>

            {/* Tickets Table */}
            <StyledCard>
                <CardHeader
                    title={
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Danh sách vé
                        </Typography>
                    }
                    action={
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={() => setFilterOpen(true)}
                                sx={{
                                    borderRadius: 3,
                                    px: 2,
                                    borderWidth: 1.5,
                                }}
                            >
                                Lọc
                                {Object.values(filters).some(x => x !== '' && x !== null) && (
                                    <Chip
                                        size="small"
                                        label={Object.values(filters).filter(x => x !== '' && x !== null).length}
                                        color="primary"
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </Button>
                        </Box>
                    }
                    sx={{ px: 3, py: 2.5 }}
                />
                <Divider />
                <CardContent sx={{ p: 3 }}>
                    {/* Search Bar */}
                    <Box sx={{ display: "flex", mb: 4 }}>
                        <SearchField
                            size="small"
                            placeholder="Tìm kiếm theo mã vé, tên KH hoặc SĐT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                                ),
                            }}
                            fullWidth
                            sx={{ mr: 2, maxWidth: 300 }}
                        />
                    </Box>

                    {/* Tickets Table */}
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
                                    <TableCell sx={{ fontWeight: 600 }}>Mã đặt vé</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Khách hàng</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Chuyến xe</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Ngày khởi hành</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Ghế</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Tổng tiền</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                 {filteredTickets.length > 0 ? (
                                    filteredTickets.map(ticket => (
                                        <TableRow
                                            key={ticket.id}
                                            hover
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: alpha("#3f51b5", 0.04),
                                                },
                                            }}
                                        >
                                            <TableCell>{ticket.bookingCode}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Avatar
                                                        sx={{
                                                            mr: 2,
                                                            bgcolor: alpha("#3f51b5", 0.1),
                                                            color: "#3f51b5",
                                                        }}
                                                    >
                                                        {ticket.customerName[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography fontWeight={500}>
                                                            {ticket.customerName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {ticket.phone}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{ticket.tripName}</TableCell>
                                            <TableCell>
                                                {formatDate(ticket.departureTime)}<br />
                                                <Typography variant="caption">{formatTime(ticket.departureTime)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                {ticket.seats.map(seat => (
                                                    <Chip
                                                        key={seat}
                                                        label={seat}
                                                        size="small"
                                                        sx={{
                                                            m: 0.2,
                                                            borderRadius: "12px",
                                                            backgroundColor: alpha("#3f51b5", 0.1),
                                                            color: "#3f51b5",
                                                        }}
                                                    />
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <Typography fontWeight={500}>
                                                    {formatCurrency(ticket.totalAmount)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={ticket.status}
                                                    size="small"
                                                    color={getStatusProperties(ticket.status).color}
                                                    icon={getStatusProperties(ticket.status).icon}
                                                    sx={{
                                                        borderRadius: "12px",
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="In vé">
                                                    <IconButton
                                                        color="info"
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedTicket(ticket);
                                                            setPrintOpen(true);
                                                        }}
                                                        sx={{
                                                            '&:hover': {
                                                                backgroundColor: alpha("#2196f3", 0.1),
                                                            },
                                                        }}
                                                    >
                                                        <PrintIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                            <Typography variant="subtitle1">Không tìm thấy vé nào phù hợp</Typography>
                                            <Button
                                                variant="text"
                                                startIcon={<ClearIcon />}
                                                onClick={resetFilters}
                                                sx={{ mt: 1 }}
                                            >
                                                Xóa bộ lọc
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </StyledCard>

            {/* Filter Dialog */}
            <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Bộ lọc
                    {Object.values(filters).some(x => x !== '' && x !== null) && (
                        <Button size="small" variant="text" onClick={resetFilters} startIcon={<ClearIcon />} sx={{ ml: 2 }}>
                            Xóa bộ lọc
                        </Button>
                    )}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ my: 2 }}><Divider /></Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={filters.status}
                                    onChange={e => setFilters({...filters, status: e.target.value})}
                                    label="Trạng thái"
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    <MenuItem value="Chờ thanh toán">Chờ thanh toán</MenuItem>
                                    <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                                    <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                                    <MenuItem value="Hủy">Hủy</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Chuyến xe</InputLabel>
                                <Select
                                    value={filters.trip}
                                    onChange={e => setFilters({...filters, trip: e.target.value})}
                                    label="Chuyến xe"
                                >
                                    <MenuItem value="">Tất cả</MenuItem>
                                    {tripOptions.map(trip => (
                                        <MenuItem key={trip.code} value={trip.code}>{trip.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFilterOpen(false)} variant="contained">Áp dụng</Button>
                </DialogActions>
            </Dialog>

            {/* Print Ticket Dialog */}
            <Dialog open={printOpen} onClose={() => setPrintOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center">
                        <TicketIcon sx={{ mr: 1 }} />
                        Vé điện tử
                        <IconButton
                            onClick={() => setPrintOpen(false)}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedTicket && (
                        <Box id="printable-ticket" sx={{ p: 2 }}>
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Typography variant="h5" gutterBottom>Vé xe khách</Typography>
                                <Typography variant="h6">Tuyến Hà Nội ↔ Lào Cai</Typography>
                                <Chip
                                    label={selectedTicket.status}
                                    color={getStatusProperties(selectedTicket.status).color}
                                    sx={{ mt: 2 }}
                                />
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Thông tin khách hàng</Typography>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="body1"><strong>{selectedTicket.customerName}</strong></Typography>
                                        <Typography variant="body2">SĐT: {selectedTicket.phone}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">Thông tin vé</Typography>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="body1"><strong>{selectedTicket.tripName}</strong></Typography>
                                        <Typography variant="body2">
                                            Ngày: {formatDate(selectedTicket.departureTime)}
                                        </Typography>
                                        <Typography variant="body2">
                                            Giờ: {formatTime(selectedTicket.departureTime)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">Thông tin ghế & thanh toán</Typography>
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="body2">Số ghế: {selectedTicket.seats.join(', ')}</Typography>
                                                <Typography variant="body2">Số lượng: {selectedTicket.seats.length} ghế</Typography>
                                                <Typography variant="body2">Thanh toán: {selectedTicket.paymentMethod}</Typography>
                                            </Grid>
                                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                                <Typography variant="body1"><strong>Tổng tiền:</strong></Typography>
                                                <Typography variant="h6" color="primary">
                                                    {selectedTicket.totalAmount.toLocaleString()} VNĐ
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPrintOpen(false)}>Đóng</Button>
                    <Button
                        variant="contained"
                        startIcon={<PrintIcon />}
                        onClick={() => {
                            window.print();
                            showSnackbar('Vé đã được gửi đến máy in', 'success');
                            setPrintOpen(false);
                        }}
                    >
                        In vé
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default TicketManagementDashboard;
