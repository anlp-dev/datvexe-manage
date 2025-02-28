import React, {useEffect, useState} from 'react';
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
import {notifyError, notifySuccess} from "../../components/notification/ToastNotification.jsx";
import SystemService from "../../services/SystemService.jsx";
import Loading from "../../components/loading/Loading.jsx";

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
    const [pageSize, setPageSize] = useState(10);
    const [dataChart, setDataChart] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            try{
                setIsLoading(true)
                const resData = await SystemService.getLogRequest();
                if(resData.status === 200){
                    formatData(resData.data);
                }
            }catch (e) {
                notifyError(e.message);
            }finally {
                setIsLoading(false);
            }
        }
        fetchData()
    }, []);

    // Calculate stats
    const totalRequests = dataTable.length;
    const successfulRequests = dataTable.filter(log => log.statusCode >= 200 && log.statusCode < 300).length;
    const clientErrors = dataTable.filter(log => log.statusCode >= 400 && log.statusCode < 500).length;
    const serverErrors = dataTable.filter(log => log.statusCode >= 500).length;


    const formatData = (data) => {
        try{
            setDataTable(data);
            const groupedData = {};
            data.forEach((d) => {
                if (!d.createdAt) return; // Bỏ qua nếu không có createdAt

                const date = new Date(d.createdAt);
                const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                const hourKey = `${date.getHours().toString().padStart(2, '0')}:00`;
                const fullKey = `${dateKey} ${hourKey}`; // Nhóm theo ngày + giờ

                if (!groupedData[fullKey]) {
                    groupedData[fullKey] = { time: fullKey, success: 0, error: 0, warning: 0 };
                }

                if (d.statusCode >= 200 && d.statusCode < 300) {
                    groupedData[fullKey].success++;
                } else if (d.statusCode >= 300 && d.statusCode < 400) {
                    groupedData[fullKey].warning++;
                } else if (d.statusCode >= 400) {
                    groupedData[fullKey].error++;
                }
            });
            setDataChart(Object.values(groupedData).sort((a, b) => a.time.localeCompare(b.time)))
        }catch (e) {
            notifyError(e.message)
        }
    }

    // DataGrid columns
    const columns = [
        {
            field: 'createdAt',
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
            field: 'url',
            headerName: 'Endpoint',
            width: 150,
            flex: 1
        },
        {
            field: 'ip',
            headerName: 'IP',
            width: 130
        },
        {
            field: 'statusCode',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => <StatusChip status={params.value} />
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
            {isLoading &&
                <>
                    <Loading/>
                </>}
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
                    Giám sát Request Logs
                </Typography>
            </Box>

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
                                    <IconButton>
                                        <RefreshIcon />
                                    </IconButton>
                                </Box>
                            }
                        />
                        <CardContent sx={{ flexGrow: 1, height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataChart}>
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
                                    rows={dataTable}
                                    columns={columns}
                                    pagination
                                    pageSize={pageSize}
                                    rowsPerPageOptions={[5, 10, 20, 50]}
                                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                    checkboxSelection
                                    disableSelectionOnClick
                                    experimentalFeatures={{ newEditingApi: true }}
                                    getRowId={(row) => row._id}
                                    getRowClassName={(params) => {
                                        if (params.row.statusCode >= 500) return 'error-row';
                                        if (params.row.statusCode >= 400) return 'warning-row';
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