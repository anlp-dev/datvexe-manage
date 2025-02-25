import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Container,
    Card,
    CardContent,
    CardHeader,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    LinearProgress,
    Tooltip
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    AttachMoney as MoneyIcon,
    MoreVert as MoreVertIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    PersonAdd as PersonAddIcon,
    ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Sample data for charts
const salesData = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
    { name: 'Jul', value: 4300 },
];

const visitorData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 2398 },
    { name: 'Mar', value: 3800 },
    { name: 'Apr', value: 4908 },
    { name: 'May', value: 5800 },
    { name: 'Jun', value: 4800 },
    { name: 'Jul', value: 6300 },
];

// Sample data for recent transactions
const recentTransactions = [
    {
        id: 1,
        customer: 'John Doe',
        amount: '$120.00',
        status: 'completed',
        date: '2 hours ago',
        avatar: 'J'
    },
    {
        id: 2,
        customer: 'Jane Smith',
        amount: '$75.50',
        status: 'pending',
        date: '5 hours ago',
        avatar: 'S'
    },
    {
        id: 3,
        customer: 'Robert Johnson',
        amount: '$250.75',
        status: 'completed',
        date: 'Yesterday',
        avatar: 'R'
    },
    {
        id: 4,
        customer: 'Emily Davis',
        amount: '$180.25',
        status: 'cancelled',
        date: 'Yesterday',
        avatar: 'E'
    },
];

// Sample data for new users
const newUsers = [
    { id: 1, name: 'Michael Brown', role: 'Customer', date: '2 hours ago', avatar: 'M' },
    { id: 2, name: 'Sarah Wilson', role: 'Admin', date: '1 day ago', avatar: 'S' },
    { id: 3, name: 'David Lee', role: 'Customer', date: '2 days ago', avatar: 'D' },
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

const StatusAvatar = styled(Avatar)(({ theme, status }) => {
    const statusColors = {
        completed: '#4caf50',
        pending: '#ff9800',
        cancelled: '#f44336'
    };

    return {
        backgroundColor: statusColors[status] || theme.palette.grey[500],
        width: theme.spacing(3),
        height: theme.spacing(3),
        fontSize: '0.75rem'
    };
});

// Dashboard Home Component
const HomeAdmin = () => {
    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                Dashboard Overview
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#3f51b5">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Total Users
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                2,543
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">
                                    +12% this week
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <PeopleIcon />
                        </Avatar>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#f50057">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Total Orders
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                1,753
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">
                                    +5% this week
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <ShoppingCartIcon />
                        </Avatar>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard color="#00bcd4">
                        <Box>
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                Total Revenue
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                $45,231
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingUpIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">
                                    +8% this month
                                </Typography>
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
                                New Customers
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                89
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <TrendingDownIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                                <Typography variant="caption">
                                    -3% this week
                                </Typography>
                            </Box>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                            <NotificationsIcon />
                        </Avatar>
                    </StatCard>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3} sx={{ mt: 4, mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <StyledCard>
                        <CardHeader
                            title="Sales Overview"
                            subheader="Monthly Sales Performance"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <CardContent sx={{ flexGrow: 1, height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8884d8"
                                        activeDot={{ r: 8 }}
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} md={4}>
                    <StyledCard>
                        <CardHeader
                            title="Visitors"
                            subheader="Monthly User Traffic"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <CardContent sx={{ flexGrow: 1, height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={visitorData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <StyledCard>
                        <CardHeader
                            title="Recent Transactions"
                            subheader="Latest order activities"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <CardContent sx={{ px: 0 }}>
                            <List>
                                {recentTransactions.map((transaction, index) => (
                                    <React.Fragment key={transaction.id}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <StatusAvatar status={transaction.status}>
                                                    {transaction.avatar}
                                                </StatusAvatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={transaction.customer}
                                                secondary={transaction.date}
                                                sx={{ flexGrow: 2 }}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ flexGrow: 1, textAlign: 'right', mr: 2 }}
                                            >
                                                {transaction.amount}
                                            </Typography>
                                            <ListItemSecondaryAction>
                                                <Tooltip title={transaction.status}>
                                                    <Box
                                                        sx={{
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            bgcolor:
                                                                transaction.status === 'completed'
                                                                    ? 'success.main'
                                                                    : transaction.status === 'pending'
                                                                        ? 'warning.main'
                                                                        : 'error.main',
                                                        }}
                                                    />
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {index < recentTransactions.length - 1 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Grid container spacing={3} direction="column">
                        <Grid item>
                            <StyledCard>
                                <CardHeader
                                    title="New Users"
                                    subheader="Recently joined members"
                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                />
                                <CardContent sx={{ px: 0 }}>
                                    <List>
                                        {newUsers.map((user, index) => (
                                            <React.Fragment key={user.id}>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>{user.avatar}</Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={user.name}
                                                        secondary={user.role}
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        {user.date}
                                                    </Typography>
                                                </ListItem>
                                                {index < newUsers.length - 1 && <Divider variant="inset" component="li" />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </CardContent>
                            </StyledCard>
                        </Grid>

                        <Grid item>
                            <StyledCard>
                                <CardHeader
                                    title="System Health"
                                    subheader="Resource usage"
                                />
                                <CardContent>
                                    <Typography variant="body2" gutterBottom>
                                        CPU Usage
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={70}
                                        color="primary"
                                        sx={{ height: 8, borderRadius: 4, mb: 2 }}
                                    />

                                    <Typography variant="body2" gutterBottom>
                                        Memory Usage
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={45}
                                        color="secondary"
                                        sx={{ height: 8, borderRadius: 4, mb: 2 }}
                                    />

                                    <Typography variant="body2" gutterBottom>
                                        Storage Usage
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={25}
                                        color="success"
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

export default HomeAdmin;