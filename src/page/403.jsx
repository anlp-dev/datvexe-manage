import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';

const AccessDeniedPage = () => {
    return (
        <Container maxWidth="md" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
        }}>
            <LockIcon sx={{ fontSize: 100, color: '#ff9800' }} /> {/* Icon màu cam */}
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#333' }}>
                403 - Không có quyền truy cập
            </Typography>
            <Typography variant="body1" align="center" sx={{ color: '#666', marginBottom: 2 }}>
                Bạn không có quyền truy cập vào trang này.
            </Typography>
            <Button component={Link} to="/" variant="contained" color="primary">
                Quay về trang chủ
            </Button>
        </Container>
    );
};

export default AccessDeniedPage;