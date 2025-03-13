import React, { useState } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Grid, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputLabel, Select, MenuItem, IconButton,
    Chip, Card, CardContent, CardHeader, Avatar,
    Tooltip, Container, Snackbar, Alert, Divider,
    Tab, Tabs
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add as AddIcon,
    FileDownload as FileDownloadIcon,
    Receipt as ReceiptIcon,
    Refresh as RefreshIcon,
    AttachMoney as MoneyIcon,
    TrendingUp as TrendingUpIcon,
    PieChart as PieChartIcon,
    ViewList as ViewListIcon,
    DateRange as DateRangeIcon
} from '@mui/icons-material';

// Dữ liệu mẫu cho lịch sử thanh toán
const initialPayments = [
    {
        id: 1,
        bookingCode: 'HN-LC-B001',
        amount: 250000,
        paymentMethod: 'VNPay',
        paymentDate: '2025-02-25',
        status: 'Thành công',
        customerName: 'Nguyễn Văn A',
        routeName: 'Hà Nội ↔ Lào Cai'
    },
    {
        id: 2,
        bookingCode: 'HN-LC-B002',
        amount: 500000,
        paymentMethod: 'MoMo',
        paymentDate: '2025-02-26',
        status: 'Thành công',
        customerName: 'Trần Thị B',
        routeName: 'Hà Nội ↔ Lào Cai'
    },
    {
        id: 3,
        bookingCode: 'HN-LC-B003',
        amount: 250000,
        paymentMethod: 'Tiền mặt',
        paymentDate: '2025-02-26',
        status: 'Thành công',
        customerName: 'Lê Văn C',
        routeName: 'Hà Nội ↔ Lào Cai'
    },
    {
        id: 4,
        bookingCode: 'HN-LC-B004',
        amount: 280000,
        paymentMethod: 'Chuyển khoản',
        paymentDate: '2025-02-27',
        status: 'Thành công',
        customerName: 'Phạm Thị D',
        routeName: 'Lào Cai ↔ Hà Nội'
    },
    {
        id: 5,
        bookingCode: 'HN-LC-B005',
        amount: 250000,
        paymentMethod: 'VNPay',
        paymentDate: '2025-02-27',
        status: 'Lỗi',
        customerName: 'Hoàng Văn E',
        routeName: 'Hà Nội ↔ Lào Cai'
    },
    {
        id: 6,
        bookingCode: 'HN-LC-B006',
        amount: 280000,
        paymentMethod: 'MoMo',
        paymentDate: '2025-02-28',
        status: 'Chờ thanh toán',
        customerName: 'Vũ Thị F',
        routeName: 'Lào Cai ↔ Hà Nội'
    },
];

// Dữ liệu mẫu cho doanh thu
const revenueData = {
    daily: [
        { date: '25/02/2025', amount: 750000, transactions: 3 },
        { date: '26/02/2025', amount: 750000, transactions: 2 },
        { date: '27/02/2025', amount: 530000, transactions: 2 },
        { date: '28/02/2025', amount: 280000, transactions: 1 },
    ],
    routes: [
        { name: 'Hà Nội ↔ Lào Cai', amount: 1750000, transactions: 5 },
        { name: 'Lào Cai ↔ Hà Nội', amount: 560000, transactions: 2 },
    ]
};

const paymentMethods = ['VNPay', 'MoMo', 'Chuyển khoản', 'Tiền mặt'];
const statusOptions = ['Thành công', 'Lỗi', 'Chờ thanh toán', 'Đã hoàn tiền'];

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

function PaymentManagementDashboard() {
    const [payments, setPayments] = useState(initialPayments);
    const [tabValue, setTabValue] = useState(0);
    const [dateFilter, setDateFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const totalRevenue = payments.reduce((sum, payment) =>
        payment.status === 'Thành công' ? sum + payment.amount : sum, 0);
    const pendingPayments = payments.filter(payment => payment.status === 'Chờ thanh toán').length;
    const errorPayments = payments.filter(payment => payment.status === 'Lỗi').length;
    const successPayments = payments.filter(payment => payment.status === 'Thành công').length;

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDateFilterChange = (event) => {
        setDateFilter(event.target.value);
    };

    const handleMethodFilterChange = (event) => {
        setMethodFilter(event.target.value);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleViewReceipt = (payment) => {
        setSelectedPayment(payment);
        setReceiptOpen(true);
    };

    const handleCloseReceipt = () => {
        setReceiptOpen(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const exportReport = () => {
        showSnackbar('Đã xuất báo cáo doanh thu thành công!', 'success');
    };

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'Thành công': return 'success';
            case 'Lỗi': return 'error';
            case 'Chờ thanh toán': return 'warning';
            case 'Đã hoàn tiền': return 'info';
            default: return 'default';
        }
    };

    // Filter payments
    const filteredPayments = payments.filter(payment => {
        let includePayment = true;

        if (methodFilter !== 'all' && payment.paymentMethod !== methodFilter) {
            includePayment = false;
        }

        if (statusFilter !== 'all' && payment.status !== statusFilter) {
            includePayment = false;
        }

        // For simplicity, we're just checking if date includes the filter value
        if (dateFilter !== 'all' && !payment.paymentDate.includes(dateFilter)) {
            includePayment = false;
        }

        return includePayment;
    });

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
                    Quản lý Thanh toán
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#3f51b5">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Tổng doanh thu
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {totalRevenue.toLocaleString()} đ
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">+12% so với tuần trước</Typography>
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
                                Thanh toán thành công
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {successPayments}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="caption">trong tháng này</Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <ReceiptIcon />
                        </Avatar>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#ff9800">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Chờ thanh toán
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {pendingPayments}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="caption">cần xử lý</Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <MoneyIcon />
                        </Avatar>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#f44336">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Giao dịch lỗi
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {errorPayments}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="caption">cần kiểm tra</Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <MoneyIcon />
                        </Avatar>
                    </StatCard>
                </Grid>
            </Grid>

            <StyledCard sx={{ mb: 4 }}>
                <CardHeader
                    title="Quản lý Thanh toán & Báo cáo"
                    action={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={() => {
                                    setPayments(initialPayments);
                                    setDateFilter('all');
                                    setMethodFilter('all');
                                    setStatusFilter('all');
                                }}
                            >
                                Làm mới
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<FileDownloadIcon />}
                                onClick={exportReport}
                            >
                                Xuất báo cáo
                            </Button>
                        </Box>
                    }
                />
                <Divider />
                <CardContent>
                    <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                        <Tab icon={<ViewListIcon />} label="Lịch sử thanh toán" />
                        <Tab icon={<PieChartIcon />} label="Báo cáo doanh thu" />
                    </Tabs>

                    {tabValue === 0 && (
                        <>
                            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel>Ngày thanh toán</InputLabel>
                                    <Select
                                        value={dateFilter}
                                        label="Ngày thanh toán"
                                        onChange={handleDateFilterChange}
                                    >
                                        <MenuItem value="all">Tất cả</MenuItem>
                                        <MenuItem value="2025-02">Tháng 2/2025</MenuItem>
                                        <MenuItem value="2025-02-28">Hôm nay (28/02/2025)</MenuItem>
                                        <MenuItem value="2025-02-27">Hôm qua (27/02/2025)</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel>Phương thức</InputLabel>
                                    <Select
                                        value={methodFilter}
                                        label="Phương thức"
                                        onChange={handleMethodFilterChange}
                                    >
                                        <MenuItem value="all">Tất cả</MenuItem>
                                        {paymentMethods.map(method => (
                                            <MenuItem key={method} value={method}>{method}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select
                                        value={statusFilter}
                                        label="Trạng thái"
                                        onChange={handleStatusFilterChange}
                                    >
                                        <MenuItem value="all">Tất cả</MenuItem>
                                        {statusOptions.map(status => (
                                            <MenuItem key={status} value={status}>{status}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <StyledTableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Mã đặt vé</TableCell>
                                            <TableCell>Khách hàng</TableCell>
                                            <TableCell>Tuyến xe</TableCell>
                                            <TableCell>Số tiền</TableCell>
                                            <TableCell>Phương thức</TableCell>
                                            <TableCell>Ngày thanh toán</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell align="center">Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredPayments.map((payment) => (
                                            <TableRow key={payment.id} hover>
                                                <TableCell>{payment.bookingCode}</TableCell>
                                                <TableCell>{payment.customerName}</TableCell>
                                                <TableCell>{payment.routeName}</TableCell>
                                                <TableCell>{payment.amount.toLocaleString()} đ</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={payment.paymentMethod}
                                                        size="small"
                                                        color={
                                                            payment.paymentMethod === 'VNPay' ? 'primary' :
                                                                payment.paymentMethod === 'MoMo' ? 'secondary' :
                                                                    payment.paymentMethod === 'Chuyển khoản' ? 'info' : 'default'
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>{payment.paymentDate.split('-').reverse().join('/')}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={payment.status}
                                                        size="small"
                                                        color={getStatusChipColor(payment.status)}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Xem biên lai">
                                                        <IconButton color="primary" onClick={() => handleViewReceipt(payment)}>
                                                            <ReceiptIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </StyledTableContainer>
                        </>
                    )}

                    {tabValue === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardHeader
                                        title="Doanh thu theo ngày"
                                        subheader="Tổng hợp 7 ngày gần nhất"
                                        avatar={<Avatar sx={{ bgcolor: '#3f51b5' }}><DateRangeIcon /></Avatar>}
                                    />
                                    <Divider />
                                    <CardContent>
                                        <StyledTableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Ngày</TableCell>
                                                        <TableCell>Số giao dịch</TableCell>
                                                        <TableCell>Doanh thu</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {revenueData.daily.map((item, index) => (
                                                        <TableRow key={index} hover>
                                                            <TableCell>{item.date}</TableCell>
                                                            <TableCell>{item.transactions}</TableCell>
                                                            <TableCell>{item.amount.toLocaleString()} đ</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow sx={{ bgcolor: 'rgba(63, 81, 181, 0.1)' }}>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Tổng</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                                            {revenueData.daily.reduce((sum, item) => sum + item.transactions, 0)}
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                                            {revenueData.daily.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} đ
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </StyledTableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardHeader
                                        title="Doanh thu theo tuyến xe"
                                        subheader="Trong tháng hiện tại"
                                        avatar={<Avatar sx={{ bgcolor: '#f50057' }}><PieChartIcon /></Avatar>}
                                    />
                                    <Divider />
                                    <CardContent>
                                        <StyledTableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Tuyến xe</TableCell>
                                                        <TableCell>Số giao dịch</TableCell>
                                                        <TableCell>Doanh thu</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {revenueData.routes.map((item, index) => (
                                                        <TableRow key={index} hover>
                                                            <TableCell>{item.name}</TableCell>
                                                            <TableCell>{item.transactions}</TableCell>
                                                            <TableCell>{item.amount.toLocaleString()} đ</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow sx={{ bgcolor: 'rgba(245, 0, 87, 0.1)' }}>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Tổng</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                                            {revenueData.routes.reduce((sum, item) => sum + item.transactions, 0)}
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>
                                                            {revenueData.routes.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} đ
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </StyledTableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </CardContent>
            </StyledCard>

            {/* Dialog to view receipt */}
            {selectedPayment && (
                <Dialog open={receiptOpen} onClose={handleCloseReceipt} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        Biên lai thanh toán
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                BIÊN LAI THANH TOÁN
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {new Date().toLocaleDateString('vi-VN')}
                            </Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Mã đặt vé
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {selectedPayment.bookingCode}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Tuyến xe
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {selectedPayment.routeName}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Khách hàng
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {selectedPayment.customerName}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Phương thức thanh toán
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {selectedPayment.paymentMethod}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Ngày thanh toán
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {selectedPayment.paymentDate.split('-').reverse().join('/')}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Trạng thái
                                </Typography>
                                <Chip
                                    label={selectedPayment.status}
                                    size="small"
                                    color={getStatusChipColor(selectedPayment.status)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle1">
                                        Tổng tiền
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {selectedPayment.amount.toLocaleString()} đ
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={handleCloseReceipt} variant="outlined">Đóng</Button>
                        <Button variant="contained" color="primary" startIcon={<FileDownloadIcon />}>
                            Tải biên lai
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

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

export default PaymentManagementDashboard;