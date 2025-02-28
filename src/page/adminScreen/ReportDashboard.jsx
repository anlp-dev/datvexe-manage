import React, { useState } from 'react';
import {
    Box, Container, Typography, Grid, Card, CardContent, CardHeader,
    Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, FormControl, InputLabel, Select, MenuItem,
    Button, Divider, Avatar, IconButton, Tooltip
} from '@mui/material';
import {
    TrendingUp, People, Speed, Cancel, CalendarMonth,
    FileDownload, Refresh,
    Person, DirectionsBus
} from '@mui/icons-material';

// Sample data
const revenueData = {
    daily: [
        { date: '25/02/2025', amount: 7560000, bookings: 32 },
        { date: '26/02/2025', amount: 8210000, bookings: 35 },
        { date: '27/02/2025', amount: 6890000, bookings: 29 },
        { date: '28/02/2025', amount: 9450000, bookings: 40 },
    ],
    monthly: [
        { month: '11/2024', amount: 178500000, bookings: 750 },
        { month: '12/2024', amount: 201300000, bookings: 845 },
        { month: '01/2025', amount: 195600000, bookings: 820 },
        { month: '02/2025', amount: 189700000, bookings: 795 },
    ],
    yearly: [
        { year: '2022', amount: 1875000000, bookings: 7850 },
        { year: '2023', amount: 2156000000, bookings: 9020 },
        { year: '2024', amount: 2350000000, bookings: 9845 },
    ]
};

const driverPerformanceData = [
    { id: 'TX001', name: 'Nguyễn Văn An', trips: 42, rating: 4.8, onTimeRate: 96, satisfaction: 92 },
    { id: 'TX012', name: 'Trần Minh Bảo', trips: 38, rating: 4.9, onTimeRate: 98, satisfaction: 95 },
    { id: 'TX008', name: 'Lê Thanh Cường', trips: 45, rating: 4.6, onTimeRate: 92, satisfaction: 89 },
    { id: 'TX015', name: 'Phạm Quốc Dũng', trips: 40, rating: 4.7, onTimeRate: 94, satisfaction: 91 },
    { id: 'TX003', name: 'Hoàng Minh Đức', trips: 36, rating: 4.5, onTimeRate: 91, satisfaction: 87 },
];

const highCancellationRoutesData = [
    { route: 'Hà Nội ↔ Lào Cai', trips: 120, cancellations: 12, rate: 10.0, primaryReason: 'Thời tiết xấu' },
    { route: 'TP HCM ↔ Đà Lạt', trips: 95, cancellations: 8, rate: 8.4, primaryReason: 'Kẹt xe' },
    { route: 'Hà Nội ↔ Hải Phòng', trips: 150, cancellations: 9, rate: 6.0, primaryReason: 'Sự cố kỹ thuật' },
    { route: 'TP HCM ↔ Vũng Tàu', trips: 200, cancellations: 10, rate: 5.0, primaryReason: 'Thiếu hành khách' },
    { route: 'Đà Nẵng ↔ Huế', trips: 80, cancellations: 4, rate: 5.0, primaryReason: 'Sự cố kỹ thuật' },
];

const bookingData = {
    byRoute: [
        { route: 'Hà Nội ↔ Lào Cai', count: 520, percent: 28 },
        { route: 'TP HCM ↔ Đà Lạt', count: 420, percent: 23 },
        { route: 'Đà Nẵng ↔ Huế', count: 320, percent: 17 },
        { route: 'Hà Nội ↔ Hải Phòng', count: 280, percent: 15 },
        { route: 'TP HCM ↔ Vũng Tàu', count: 320, percent: 17 },
    ],
    byTime: [
        { time: 'Sáng (6h-12h)', count: 680, percent: 37 },
        { time: 'Chiều (12h-18h)', count: 560, percent: 30 },
        { time: 'Tối (18h-24h)', count: 450, percent: 24 },
        { time: 'Đêm (0h-6h)', count: 170, percent: 9 },
    ]
};

function ReportsDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [timeFilter, setTimeFilter] = useState('month');
    const [routeFilter, setRouteFilter] = useState('all');

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleTimeFilterChange = (event) => {
        setTimeFilter(event.target.value);
    };

    const handleRouteFilterChange = (event) => {
        setRouteFilter(event.target.value);
    };

    const exportReport = () => {
        alert('Đã xuất báo cáo thành công!');
    };

    const getRevenueData = () => {
        switch(timeFilter) {
            case 'day': return revenueData.daily;
            case 'month': return revenueData.monthly;
            case 'year': return revenueData.yearly;
            default: return revenueData.monthly;
        }
    };

    const renderRevenueReport = () => {
        const data = getRevenueData();
        const timeLabel = timeFilter === 'day' ? 'Ngày' :
            timeFilter === 'month' ? 'Tháng' : 'Năm';

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Thời gian</InputLabel>
                            <Select
                                value={timeFilter}
                                label="Thời gian"
                                onChange={handleTimeFilterChange}
                            >
                                <MenuItem value="day">Theo ngày</MenuItem>
                                <MenuItem value="month">Theo tháng</MenuItem>
                                <MenuItem value="year">Theo năm</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={() => setTimeFilter('month')}
                        >
                            Làm mới
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FileDownload />}
                            onClick={exportReport}
                        >
                            Xuất báo cáo
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>{timeLabel}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>Số lượng đặt vé</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>Doanh thu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>
                                            {timeFilter === 'day' ? row.date :
                                                timeFilter === 'month' ? row.month : row.year}
                                        </TableCell>
                                        <TableCell align="right">{row.bookings.toLocaleString()}</TableCell>
                                        <TableCell align="right">{row.amount.toLocaleString()} đ</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Tổng</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {data.reduce((sum, item) => sum + item.bookings, 0).toLocaleString()}
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {data.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} đ
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                        <CardHeader
                            title="Tổng quan doanh thu"
                            avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><TrendingUp /></Avatar>}
                        />
                        <CardContent>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary">Tổng doanh thu</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {data.reduce((sum, item) => sum + item.amount, 0).toLocaleString()} đ
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary">Tổng số lượng đặt vé</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {data.reduce((sum, item) => sum + item.bookings, 0).toLocaleString()}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Doanh thu trung bình mỗi {timeFilter === 'day' ? 'ngày' : timeFilter === 'month' ? 'tháng' : 'năm'}</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {Math.round(data.reduce((sum, item) => sum + item.amount, 0) / data.length).toLocaleString()} đ
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    const renderBookingReport = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                        <CardHeader
                            title="Số lượng đặt vé theo tuyến"
                            avatar={<Avatar sx={{ bgcolor: '#ff9800' }}><DirectionsBus /></Avatar>}
                        />
                        <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#ff9800', color: 'white' }}>Tuyến đường</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#ff9800', color: 'white' }}>Số lượng</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#ff9800', color: 'white' }}>Tỷ lệ</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bookingData.byRoute.map((row, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{row.route}</TableCell>
                                                <TableCell align="right">{row.count.toLocaleString()}</TableCell>
                                                <TableCell align="right">{row.percent}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                        <CardHeader
                            title="Số lượng đặt vé theo khung giờ"
                            avatar={<Avatar sx={{ bgcolor: '#ff9800' }}><CalendarMonth /></Avatar>}
                        />
                        <CardContent>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', bgcolor: '#ff9800', color: 'white' }}>Khung giờ</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#ff9800', color: 'white' }}>Số lượng</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#ff9800', color: 'white' }}>Tỷ lệ</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bookingData.byTime.map((row, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{row.time}</TableCell>
                                                <TableCell align="right">{row.count.toLocaleString()}</TableCell>
                                                <TableCell align="right">{row.percent}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    const renderDriverPerformance = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#4caf50', color: 'white' }}>Mã tài xế</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#4caf50', color: 'white' }}>Tên tài xế</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#4caf50', color: 'white' }}>Số chuyến</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#4caf50', color: 'white' }}>Xếp hạng</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#4caf50', color: 'white' }}>Tỷ lệ đúng giờ</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#4caf50', color: 'white' }}>Độ hài lòng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {driverPerformanceData.map((driver) => (
                                    <TableRow key={driver.id} hover>
                                        <TableCell>{driver.id}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ mr: 1, bgcolor: '#4caf50', width: 32, height: 32 }}>
                                                    <Person fontSize="small" />
                                                </Avatar>
                                                {driver.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">{driver.trips}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{driver.rating}</Typography>
                                                <Typography variant="body2" color="text.secondary">/5</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{
                                                bgcolor: driver.onTimeRate >= 95 ? '#e8f5e9' :
                                                    driver.onTimeRate >= 90 ? '#fff8e1' : '#ffebee',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                display: 'inline-block',
                                                fontWeight: 'bold',
                                                color: driver.onTimeRate >= 95 ? '#2e7d32' :
                                                    driver.onTimeRate >= 90 ? '#f57c00' : '#c62828'
                                            }}>
                                                {driver.onTimeRate}%
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{
                                                bgcolor: driver.satisfaction >= 90 ? '#e8f5e9' :
                                                    driver.satisfaction >= 85 ? '#fff8e1' : '#ffebee',
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                display: 'inline-block',
                                                fontWeight: 'bold',
                                                color: driver.satisfaction >= 90 ? '#2e7d32' :
                                                    driver.satisfaction >= 85 ? '#f57c00' : '#c62828'
                                            }}>
                                                {driver.satisfaction}%
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        );
    };

    const renderCancellationReport = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Tuyến đường</InputLabel>
                            <Select
                                value={routeFilter}
                                label="Tuyến đường"
                                onChange={handleRouteFilterChange}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                {highCancellationRoutesData.map((route, index) => (
                                    <MenuItem key={index} value={route.route}>{route.route}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f44336', color: 'white' }}>Tuyến đường</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#f44336', color: 'white' }}>Tổng chuyến</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#f44336', color: 'white' }}>Số lần hủy</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#f44336', color: 'white' }}>Tỷ lệ hủy</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f44336', color: 'white' }}>Lý do chính</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {highCancellationRoutesData
                                    .filter(route => routeFilter === 'all' || route.route === routeFilter)
                                    .map((route, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{route.route}</TableCell>
                                            <TableCell align="center">{route.trips}</TableCell>
                                            <TableCell align="center">{route.cancellations}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{
                                                    bgcolor: route.rate <= 5 ? '#e8f5e9' :
                                                        route.rate <= 8 ? '#fff8e1' : '#ffebee',
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    display: 'inline-block',
                                                    fontWeight: 'bold',
                                                    color: route.rate <= 5 ? '#2e7d32' :
                                                        route.rate <= 8 ? '#f57c00' : '#c62828'
                                                }}>
                                                    {route.rate.toFixed(1)}%
                                                </Box>
                                            </TableCell>
                                            <TableCell>{route.primaryReason}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        );
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Báo cáo & Thống kê
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Xem và phân tích dữ liệu kinh doanh để đưa ra quyết định hiệu quả
                </Typography>
            </Box>

            <Paper sx={{ mb: 4, borderRadius: 2 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab icon={<TrendingUp />} label="Doanh thu" id="tab-0" />
                    <Tab icon={<People />} label="Đặt vé" id="tab-1" />
                    <Tab icon={<Speed />} label="Hiệu suất tài xế" id="tab-2" />
                    <Tab icon={<Cancel />} label="Tỷ lệ hủy cao" id="tab-3" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 0 && renderRevenueReport()}
                    {tabValue === 1 && renderBookingReport()}
                    {tabValue === 2 && renderDriverPerformance()}
                    {tabValue === 3 && renderCancellationReport()}
                </Box>
            </Paper>
        </Container>
    );
}

export default ReportsDashboard;