import React, { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Container,
    Card,
    CardContent,
    CardHeader,
    Switch,
    Slider,
    TextField,
    Button,
    Divider,
    FormControlLabel,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Save as SaveIcon,
    Refresh as RefreshIcon,
    Security as SecurityIcon,
    Login as LoginIcon,
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components (reusing from your HomeAdmin)
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

const SettingItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 0),
    '&:not(:last-child)': {
        borderBottom: `1px solid ${theme.palette.divider}`
    }
}));

// System Configuration Component
const SystemConfig = () => {
    // State for different configuration settings
    const [passwordConfig, setPasswordConfig] = useState({
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAgeDays: 90
    });

    const [loginConfig, setLoginConfig] = useState({
        maxAttempts: 5,
        lockoutDuration: 30,
        rememberMeDuration: 7,
        requireCaptcha: true,
        twoFactorAuth: 'optional', // 'disabled', 'optional', 'required'
        sessionTimeout: 30
    });

    const [registrationConfig, setRegistrationConfig] = useState({
        allowSelfRegistration: true,
        requireEmailVerification: true,
        requireApproval: false,
        invitationRequired: false,
        allowedDomains: '',
        notifyAdmins: true
    });

    // Function to handle saving all configurations
    const handleSaveConfig = () => {
        // Here you would typically make an API call to save settings
        console.log("Saving configurations:", {
            passwordConfig,
            loginConfig,
            registrationConfig
        });

        // Show success message (would implement with a snackbar in a real app)
        alert("Cấu hình đã được lưu thành công!");
    };

    // Handler for password config changes
    const handlePasswordConfigChange = (key, value) => {
        setPasswordConfig(prev => ({ ...prev, [key]: value }));
    };

    // Handler for login config changes
    const handleLoginConfigChange = (key, value) => {
        setLoginConfig(prev => ({ ...prev, [key]: value }));
    };

    // Handler for registration config changes
    const handleRegistrationConfigChange = (key, value) => {
        setRegistrationConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Cấu hình hệ thống
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        sx={{ mr: 2 }}
                    >
                        Đặt lại
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveConfig}
                    >
                        Lưu cấu hình
                    </Button>
                </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
                Thay đổi cấu hình hệ thống có thể ảnh hưởng đến trải nghiệm người dùng. Đảm bảo bạn hiểu tác động trước khi lưu thay đổi.
            </Alert>

            <Grid container spacing={3}>
                {/* Password Configuration */}
                <Grid item xs={12} md={6} lg={4}>
                    <StyledCard>
                        <CardHeader
                            title="Cấu hình mật khẩu"
                            avatar={<SecurityIcon color="primary" />}
                        />
                        <CardContent>
                            <SettingItem>
                                <Box>
                                    <Typography variant="body1">Độ dài tối thiểu</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Số ký tự tối thiểu cho mật khẩu
                                    </Typography>
                                </Box>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={passwordConfig.minLength}
                                    onChange={(e) => handlePasswordConfigChange('minLength', parseInt(e.target.value))}
                                    InputProps={{
                                        inputProps: { min: 6, max: 64 }
                                    }}
                                    sx={{ width: 100 }}
                                />
                            </SettingItem>

                            <SettingItem>
                                <Typography variant="body1">Yêu cầu chữ hoa</Typography>
                                <Switch
                                    checked={passwordConfig.requireUppercase}
                                    onChange={(e) => handlePasswordConfigChange('requireUppercase', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>

                            <SettingItem>
                                <Typography variant="body1">Yêu cầu chữ thường</Typography>
                                <Switch
                                    checked={passwordConfig.requireLowercase}
                                    onChange={(e) => handlePasswordConfigChange('requireLowercase', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>

                            <SettingItem>
                                <Typography variant="body1">Yêu cầu số</Typography>
                                <Switch
                                    checked={passwordConfig.requireNumbers}
                                    onChange={(e) => handlePasswordConfigChange('requireNumbers', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>

                            <SettingItem>
                                <Typography variant="body1">Yêu cầu ký tự đặc biệt</Typography>
                                <Switch
                                    checked={passwordConfig.requireSpecialChars}
                                    onChange={(e) => handlePasswordConfigChange('requireSpecialChars', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>

                            <SettingItem>
                                <Box>
                                    <Typography variant="body1">Thời hạn mật khẩu</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Số ngày trước khi yêu cầu đổi mật khẩu
                                    </Typography>
                                </Box>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={passwordConfig.maxAgeDays}
                                    onChange={(e) => handlePasswordConfigChange('maxAgeDays', parseInt(e.target.value))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">ngày</InputAdornment>,
                                        inputProps: { min: 0, max: 365 }
                                    }}
                                    sx={{ width: 150 }}
                                />
                            </SettingItem>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Login Configuration */}
                <Grid item xs={12} md={6} lg={4}>
                    <StyledCard>
                        <CardHeader
                            title="Cấu hình đăng nhập"
                            avatar={<LoginIcon color="primary" />}
                        />
                        <CardContent>
                            <SettingItem>
                                <Box>
                                    <Typography variant="body1">Số lần thử tối đa</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Số lần thử đăng nhập thất bại trước khi khóa
                                    </Typography>
                                </Box>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={loginConfig.maxAttempts}
                                    onChange={(e) => handleLoginConfigChange('maxAttempts', parseInt(e.target.value))}
                                    InputProps={{
                                        inputProps: { min: 1, max: 10 }
                                    }}
                                    sx={{ width: 100 }}
                                />
                            </SettingItem>

                            <SettingItem>
                                <Box>
                                    <Typography variant="body1">Thời gian khóa</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Thời gian khóa tài khoản sau nhiều lần thử thất bại
                                    </Typography>
                                </Box>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={loginConfig.lockoutDuration}
                                    onChange={(e) => handleLoginConfigChange('lockoutDuration', parseInt(e.target.value))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">phút</InputAdornment>,
                                        inputProps: { min: 5, max: 1440 }
                                    }}
                                    sx={{ width: 150 }}
                                />
                            </SettingItem>

                            <SettingItem>
                                <Box>
                                    <Typography variant="body1">Thời gian ghi nhớ</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Thời gian "Ghi nhớ đăng nhập" có hiệu lực
                                    </Typography>
                                </Box>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={loginConfig.rememberMeDuration}
                                    onChange={(e) => handleLoginConfigChange('rememberMeDuration', parseInt(e.target.value))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">ngày</InputAdornment>,
                                        inputProps: { min: 1, max: 30 }
                                    }}
                                    sx={{ width: 150 }}
                                />
                            </SettingItem>

                            <SettingItem>
                                <Typography variant="body1">Yêu cầu CAPTCHA</Typography>
                                <Switch
                                    checked={loginConfig.requireCaptcha}
                                    onChange={(e) => handleLoginConfigChange('requireCaptcha', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>

                            <SettingItem>
                                <Box>
                                    <Typography variant="body1">Xác thực hai yếu tố</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Cấu hình yêu cầu xác thực hai yếu tố (2FA)
                                    </Typography>
                                </Box>
                                <FormControl size="small" sx={{ width: 150 }}>
                                    <Select
                                        value={loginConfig.twoFactorAuth}
                                        onChange={(e) => handleLoginConfigChange('twoFactorAuth', e.target.value)}
                                    >
                                        <MenuItem value="disabled">Tắt</MenuItem>
                                        <MenuItem value="optional">Tùy chọn</MenuItem>
                                        <MenuItem value="required">Bắt buộc</MenuItem>
                                    </Select>
                                </FormControl>
                            </SettingItem>

                            <SettingItem>
                                <Box>
                                    <Typography variant="body1">Thời gian timeout phiên</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Phiên đăng nhập sẽ hết hạn sau khoảng thời gian không hoạt động
                                    </Typography>
                                </Box>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={loginConfig.sessionTimeout}
                                    onChange={(e) => handleLoginConfigChange('sessionTimeout', parseInt(e.target.value))}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">phút</InputAdornment>,
                                        inputProps: { min: 5, max: 1440 }
                                    }}
                                    sx={{ width: 150 }}
                                />
                            </SettingItem>
                        </CardContent>
                    </StyledCard>
                </Grid>

                {/* Registration Configuration */}
                <Grid item xs={12} md={6} lg={4}>
                    <StyledCard>
                        <CardHeader
                            title="Cấu hình đăng ký"
                            avatar={<NotificationsIcon color="primary" />}
                        />
                        <CardContent>
                            <SettingItem>
                                <Box>
                                    <Typography variant="body1">Cho phép tự đăng ký</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Cho phép người dùng tự đăng ký tài khoản mới
                                    </Typography>
                                </Box>
                                <Switch
                                    checked={registrationConfig.allowSelfRegistration}
                                    onChange={(e) => handleRegistrationConfigChange('allowSelfRegistration', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>

                            <SettingItem>
                                <Typography variant="body1">Yêu cầu xác minh email</Typography>
                                <Switch
                                    checked={registrationConfig.requireEmailVerification}
                                    onChange={(e) => handleRegistrationConfigChange('requireEmailVerification', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>

                            <SettingItem>
                                <Typography variant="body1">Yêu cầu phê duyệt</Typography>
                                <Switch
                                    checked={registrationConfig.requireApproval}
                                    onChange={(e) => handleRegistrationConfigChange('requireApproval', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>

                            <SettingItem>
                                <Typography variant="body1">Cần lời mời</Typography>
                                <Switch
                                    checked={registrationConfig.invitationRequired}
                                    onChange={(e) => handleRegistrationConfigChange('invitationRequired', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>

                            <SettingItem>
                                <Box>
                                    <Typography variant="body1">Tên miền cho phép</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Danh sách tên miền được phép (phân tách bằng dấu phẩy)
                                    </Typography>
                                </Box>
                                <TextField
                                    size="small"
                                    value={registrationConfig.allowedDomains}
                                    onChange={(e) => handleRegistrationConfigChange('allowedDomains', e.target.value)}
                                    placeholder="example.com,domain.com"
                                    sx={{ width: 200 }}
                                />
                            </SettingItem>

                            <SettingItem>
                                <Typography variant="body1">Thông báo cho quản trị viên</Typography>
                                <Switch
                                    checked={registrationConfig.notifyAdmins}
                                    onChange={(e) => handleRegistrationConfigChange('notifyAdmins', e.target.checked)}
                                    color="primary"
                                />
                            </SettingItem>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SystemConfig;