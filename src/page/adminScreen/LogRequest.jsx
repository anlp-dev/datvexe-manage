import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Container,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    TextField,
    InputAdornment,
    Stack
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Refresh as RefreshIcon,
    FilterList as FilterListIcon,
    Search as SearchIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataGrid } from '@mui/x-data-grid';

// Sample data for request charts
const requestData = [
    { time: '00:00', success: 145, error: 12, warning: 5 },
    { time: '01:00', success: 132, error: 8, warning: 3 },
    { time: '02:00', success: 86, error: 5, warning: 2 },
    { time: '03:00', success: 70, error: 3, warning: 1 },
    { time: '04:00', success: 55, error: 2, warning: 0 },
    { time: '05:00', success: 65, error: 1, warning: 1 },
    { time: '06:00', success: 95, error: 4, warning: 2 },
    { time: '07:00', success: 156, error: 7, warning: 4 },
    { time: '08:00', success: 245, error: 15, warning: 8 },
    { time: '09:00', success: 320, error: 22, warning: 11 },
    { time: '10:00', success: 368, error: 18, warning: 12 },
    { time: '11:00', success: 387, error: 25, warning: 15 },
    { time: '12:00', success: 376, error: 20, warning: 10 },
];

// Sample data for requests log table
const requestLogs = [
    {
        id: 1,
        timestamp: '2025-02-25 11:42:15',
        ip: '192.168.1.105',
        method: 'GET',
        endpoint: '/api/users',
        status: 200,
        responseTime: 45,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        size: '2.4 KB'
    },
    {
        id: 2,
        timestamp: '2025-02-25 11:41:55',
        ip: '192.168.1.120',
        method: 'POST',
        endpoint: '/api/auth/login',
        status: 200,
        responseTime: 120,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        size: '1.8 KB'
    },
    {
        id: 3,
        timestamp: '2025-02-25 11:41:32',
        ip: '192.168.1.105',
        method: 'GET',
        endpoint: '/api/products',
        status: 200,
        responseTime: 78,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        size: '15.7 KB'
    },
    {
        id: 4,
        timestamp: '2025-02-25 11:40:47',
        ip: '192.168.1.115',
        method: 'GET',
        endpoint: '/api/products/categories',
        status: 200,
        responseTime: 35,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        size: '4.2 KB'
    },
    {
        id: 5,
        timestamp: '2025-02-25 11:40:30',
        ip: '192.168.1.130',
        method: 'POST',
        endpoint: '/api/orders',
        status: 201,
        responseTime: 156,
        userAgent: 'PostmanRuntime/7.29.0',
        size: '1.1 KB'
    },
    {
        id: 6,
        timestamp: '2025-02-25 11:40:12',
        ip: '192.168.1.125',
        method: 'GET',
        endpoint: '/api/users/profile',
        status: 403,
        responseTime: 28,
        userAgent: 'Mozilla/5.0 (Linux; Android 12)',
        size: '0.5 KB'
    },
    {
        id: 7,
        timestamp: '2025-02-25 11:39:55',
        ip: '192.168.1.140',
        method: 'PUT',
        endpoint: '/api/users/5',
        status: 200,
        responseTime: 89,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        size: '1.3 KB'
    },
    {
        id: 8,
        timestamp: '2025-02-25 11:39:40',
        ip: '192.168.1.110',
        method: 'GET',
        endpoint: '/api/stats/daily',
        status: 500,
        responseTime: 1240,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        size: '0.3 KB'
    },
    {
        id: 9,
        timestamp: '2025-02-25 11:39:27',
        ip: '192.168.1.115',
        method: 'DELETE',
        endpoint: '/api/cart/items/3',
        status: 204,
        responseTime: 67,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        size: '0.1 KB'
    },
    {
        id: 10,
        timestamp: '2025-02-25 11:39:15',
        ip: '192.168.1.120',
        method: 'GET',
        endpoint: '/api/products/5/reviews',
        status: 200,
        responseTime: 92,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        size: '8.5 KB'
    }
];

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

// Status chip component
const StatusChip = ({ status }) => {
    let color = 'default';
    let icon = null;
    let label = status.toString();

    if (status >= 200 && status < 300) {
        color = 'success';
        icon = <SuccessIcon fontSize="small" />;
    } else if (status >= 300 && status < 400) {
        color = 'info';
        icon = <InfoIcon fontSize="small" />;
    } else if (status >= 400 && status < 500) {
        color = 'warning';
        icon = <WarningIcon fontSize="small" />;
    } else if (status >= 500) {
        color = 'error';
        icon = <ErrorIcon fontSize="small" />;
    }

    return (
        <Chip
            icon={icon}
            label={label}
            color={color}
            size="small"
            variant="filled"
        />
    );
};

// Main component
const RequestLogsInterface = () => {
    const [timeRange, setTimeRange] = useState('last12Hours');
    const [pageSize, setPageSize] = useState(10);

    // Calculate stats
    const totalRequests = requestLogs.length;
    const successfulRequests = requestLogs.filter(log => log.status >= 200 && log.status < 300).length;
    const clientErrors = requestLogs.filter(log => log.status >= 400 && log.status < 500).length;
    const serverErrors = requestLogs.filter(log => log.status >= 500).length;

    // DataGrid columns
    const columns = [
        {
            field: 'timestamp',
            headerName: 'Thời gian',
            width: 180
        },
        {
            field: 'method',
            headerName: 'Phương thức',
            width: 110,
            renderCell: (params) => {
                let color;
                switch(params.value) {
                    case 'GET': color = 'primary'; break;
                    case 'POST': color = 'success'; break;
                    case 'PUT': color = 'info'; break;
                    case 'DELETE': color = 'error'; break;
                    default: color = 'default';
                }
                return <Chip label={params.value} color={color} size="small" />;
            }
        },
        {
            field: 'endpoint',
            headerName: 'Endpoint',
            width: 220,
            flex: 1
        },
        {
            field: 'ip',
            headerName: 'IP',
            width: 130
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => <StatusChip status={params.value} />
        },
        {
            field: 'responseTime',
            headerName: 'Thời gian phản hồi',
            width: 160,
            valueFormatter: (params) => `${params.value} ms`,
            renderCell: (params) => {
                let color = 'success';
                if (params.value > 1000) color = 'error';
                else if (params.value > 300) color = 'warning';

                return (
                    <Typography
                        variant="body2"
                        color={color}
                        fontWeight={params.value > 300 ? 'bold' : 'normal'}
                    >
                        {params.value} ms
                    </Typography>
                );
            }
        },
        {
            field: 'size',
            headerName: 'Kích thước',
            width: 110
        },
        {
            field: 'userAgent',
            headerName: 'User Agent',
            width: 250,
            sortable: false
        }
    ];

    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Giám sát Request Logs
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#3f51b5">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Tổng số Request
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {totalRequests}
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                            <RefreshIcon />
                        </IconButton>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#4caf50">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Thành công (2xx)
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {successfulRequests}
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                            <SuccessIcon />
                        </IconButton>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#ff9800">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Lỗi Client (4xx)
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {clientErrors}
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                            <WarningIcon />
                        </IconButton>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#f44336">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Lỗi Server (5xx)
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                {serverErrors}
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                            <ErrorIcon />
                        </IconButton>
                    </StatCard>
                </Grid>
            </Grid>

            {/* Chart */}
            <Grid container spacing={3} sx={{ mt: 4, mb: 4 }}>
                <Grid item xs={12}>
                    <StyledCard>
                        <CardHeader
                            title="Biểu đồ Request theo thời gian"
                            action={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControl size="small" sx={{ minWidth: 150, mr: 1 }}>
                                        <InputLabel>Khoảng thời gian</InputLabel>
                                        <Select
                                            value={timeRange}
                                            label="Khoảng thời gian"
                                            onChange={(e) => setTimeRange(e.target.value)}
                                        >
                                            <MenuItem value="lastHour">1 giờ qua</MenuItem>
                                            <MenuItem value="last6Hours">6 giờ qua</MenuItem>
                                            <MenuItem value="last12Hours">12 giờ qua</MenuItem>
                                            <MenuItem value="lastDay">24 giờ qua</MenuItem>
                                            <MenuItem value="lastWeek">7 ngày qua</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <IconButton>
                                        <RefreshIcon />
                                    </IconButton>
                                </Box>
                            }
                        />
                        <CardContent sx={{ flexGrow: 1, height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={requestData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="success"
                                        name="Thành công"
                                        stroke="#4caf50"
                                        activeDot={{ r: 8 }}
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="error"
                                        name="Lỗi"
                                        stroke="#f44336"
                                        activeDot={{ r: 8 }}
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="warning"
                                        name="Cảnh báo"
                                        stroke="#ff9800"
                                        activeDot={{ r: 8 }}
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {/* Request Logs Table */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StyledCard>
                        <CardHeader
                            title="Chi tiết Request Logs"
                            action={
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        placeholder="Tìm kiếm logs..."
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <IconButton>
                                        <FilterListIcon />
                                    </IconButton>
                                    <IconButton>
                                        <RefreshIcon />
                                    </IconButton>
                                </Stack>
                            }
                        />
                        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                            <Box sx={{ height: 670, width: '100%' }}>
                                <DataGrid
                                    rows={requestLogs}
                                    columns={columns}
                                    pagination
                                    pageSize={pageSize}
                                    rowsPerPageOptions={[5, 10, 20, 50]}
                                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    experimentalFeatures={{ newEditingApi: true }}
                                    getRowClassName={(params) => {
                                        if (params.row.status >= 500) return 'error-row';
                                        if (params.row.status >= 400) return 'warning-row';
                                        return '';
                                    }}
                                    sx={{
                                        '& .error-row': {
                                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                        },
                                        '& .warning-row': {
                                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                        },
                                        border: 'none',
                                        borderRadius: 0,
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: '#f5f5f5',
                                        }
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Container>
    );
};

export default RequestLogsInterface;