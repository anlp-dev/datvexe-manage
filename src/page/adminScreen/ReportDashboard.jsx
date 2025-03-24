import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Grid, Card, CardContent, CardHeader,
    Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, FormControl, InputLabel, Select, MenuItem,
    Button, Divider, Avatar, IconButton, Tooltip, useTheme, alpha
} from '@mui/material';
import {
    TrendingUp, People, Cancel, CalendarMonth,
    FileDownload, Refresh, ArrowUpward, ArrowDownward,
    Person, DirectionsBus, AttachMoney, EventAvailable, Star
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReportService from '../../services/ReportService';
import ExportService from '../../services/ExportService';
import Loading from '../../components/loading/Loading';
import { formatCurrency } from '../../utils/format';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: theme.spacing(2),
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
    backgroundColor: theme.palette.background.paper,
}));

const StyledTab = styled(Tab)(({ theme }) => ({
    minHeight: 60,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.2s',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    '&.Mui-selected': {
        color: theme.palette.primary.main,
    },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    '& .MuiTable-root': {
        '& .MuiTableCell-head': {
            fontWeight: 600,
            whiteSpace: 'nowrap',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            '&:first-of-type': {
                borderTopLeftRadius: theme.spacing(2),
            },
            '&:last-child': {
                borderTopRightRadius: theme.spacing(2),
            },
        },
    },
}));

const StatCard = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: theme.spacing(2),
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.common.white,
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'translateY(-4px)',
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
    borderRadius: theme.spacing(5),
    transition: 'all 0.3s',
    color: theme.palette.common.white,
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    },
}));


function ReportsDashboard() {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);
    const [timeFilter, setTimeFilter] = useState('month');
    const [routeFilter, setRouteFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState({
        revenueReport: {
            totalRevenue: 0,
            totalTicket: 0,
            detail: []
        },
        percentCancelReport: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await ReportService.getReport();
            if (response.status === 200) {
                setReportData(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (e) {
            throw new Error(e);
        } finally {
            setLoading(false);
        }
    };

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
        try {
            ExportService.exportToExcel(reportData);
        } catch (error) {
            console.error('Lỗi khi xuất báo cáo:', error);
            // Thêm thông báo lỗi nếu bạn có component thông báo
        }
    };

    const renderRevenueReport = () => {
        const { revenueReport } = reportData;
        const prevPeriodChange = 0; // You might want to calculate this based on your needs

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ 
                        mb: 4,
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
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

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <GradientButton
                                startIcon={<Refresh />}
                                onClick={fetchData}
                            >
                                Làm mới
                            </GradientButton>

                            <GradientButton
                                startIcon={<FileDownload />}
                                onClick={exportReport}
                                sx={{ 
                                    background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`
                                }}
                            >
                                Xuất báo cáo
                            </GradientButton>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <StatCard>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                                    <AttachMoney />
                                </Avatar>
                                <Typography variant="h6">Tổng doanh thu</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                                {formatCurrency(revenueReport.totalRevenue)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {prevPeriodChange >= 0 ? <ArrowUpward color="inherit" /> : <ArrowDownward color="inherit" />}
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    {Math.abs(prevPeriodChange)}% so với kỳ trước
                                </Typography>
                            </Box>
                        </CardContent>
                    </StatCard>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <StatCard sx={{ 
                        background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                                    <EventAvailable />
                                </Avatar>
                                <Typography variant="h6">Tổng đặt vé</Typography>
                            </Box>
                            <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                                {revenueReport.totalTicket.toLocaleString()}
                            </Typography>
                            <Typography variant="body2">
                                Trung bình {Math.round(revenueReport.totalTicket / revenueReport.detail.length || 1)} vé/tháng
                            </Typography>
                        </CardContent>
                    </StatCard>
                </Grid>

                <Grid item xs={12}>
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                Chi tiết doanh thu theo tháng
                            </Typography>
                            <StyledTableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tháng</TableCell>
                                            <TableCell align="right">Số lượng đặt vé</TableCell>
                                            <TableCell align="right">Doanh thu</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {revenueReport.detail.map((row, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>Tháng {row.month}</TableCell>
                                                <TableCell align="right">{row.totalTicket.toLocaleString()}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.totalRevenue)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow sx={{ 
                                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                                            '& td': { fontWeight: 'bold' }
                                        }}>
                                            <TableCell>Tổng</TableCell>
                                            <TableCell align="right">{revenueReport.totalTicket.toLocaleString()}</TableCell>
                                            <TableCell align="right">{formatCurrency(revenueReport.totalRevenue)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </StyledTableContainer>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        );
    };

    const renderCancellationReport = () => {
        const { percentCancelReport } = reportData;

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel>Tuyến đường</InputLabel>
                            <Select
                                value={routeFilter}
                                label="Tuyến đường"
                                onChange={handleRouteFilterChange}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                {percentCancelReport.map((route, index) => (
                                    <MenuItem key={index} value={route.route}>{route.route}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <StyledCard>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                                    <Cancel />
                                </Avatar>
                                <Typography variant="h6">Chi tiết hủy chuyến</Typography>
                            </Box>
                            <StyledTableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tuyến đường</TableCell>
                                            <TableCell align="center">Tổng chuyến</TableCell>
                                            <TableCell align="center">Số lần hủy</TableCell>
                                            <TableCell align="center">Tỷ lệ hủy</TableCell>
                                            <TableCell align="right">Doanh thu mất</TableCell>
                                            <TableCell>Lý do hủy</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {percentCancelReport
                                            .filter(route => routeFilter === 'all' || route.route === routeFilter)
                                            .map((route, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell>{route.route}</TableCell>
                                                    <TableCell align="center">{route.tongChuyen}</TableCell>
                                                    <TableCell align="center">{route.huyChuyen}</TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{
                                                            display: 'inline-block',
                                                            px: 1.5,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            bgcolor: parseFloat(route.tiLeHuy) <= 30 ? alpha(theme.palette.success.main, 0.1) :
                                                                parseFloat(route.tiLeHuy) <= 60 ? alpha(theme.palette.warning.main, 0.1) :
                                                                alpha(theme.palette.error.main, 0.1),
                                                            color: parseFloat(route.tiLeHuy) <= 30 ? theme.palette.success.dark :
                                                                parseFloat(route.tiLeHuy) <= 60 ? theme.palette.warning.dark :
                                                                theme.palette.error.dark,
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {route.tiLeHuy}%
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ color: theme.palette.error.main }}>
                                                        {formatCurrency(route.doanhThuMat)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                            {route.lyDoHuy.map((reason, idx) => (
                                                                <Box key={idx} sx={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    gap: 2,
                                                                    '&:not(:last-child)': {
                                                                        borderBottom: '1px dashed',
                                                                        borderColor: 'divider',
                                                                        pb: 0.5
                                                                    }
                                                                }}>
                                                                    <Typography variant="body2">
                                                                        {reason}
                                                                    </Typography>
                                                                </Box>
                                                            ))}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </StyledTableContainer>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        );
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            pt: 4,
            pb: 8
        }}>
                    {loading ? <Loading fullScreen={true}/> : ""}
            <Container maxWidth={false}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: theme.palette.primary.main
                    }}>
                        Báo cáo & Thống kê
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Xem và phân tích dữ liệu kinh doanh để đưa ra quyết định hiệu quả
                    </Typography>
                </Box>

                <StyledCard sx={{ mb: 4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: '3px 3px 0 0',
                                }
                            }}
                        >
                            <StyledTab
                                icon={<TrendingUp />}
                                label="Doanh thu"
                                id="tab-0"
                                iconPosition="start"
                            />
                            <StyledTab
                                icon={<Cancel />}
                                label="Tỷ lệ hủy cao"
                                id="tab-1"
                                iconPosition="start"
                            />
                        </Tabs>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        {tabValue === 0 && renderRevenueReport()}
                        {tabValue === 1 && renderCancellationReport()}
                    </Box>
                </StyledCard>
            </Container>
        </Box>
    );
}

export default ReportsDashboard;
