import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import {keyframes, styled} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import Loading from "../components/loading/Loading.jsx";
import {notifySuccess, notifyError, notifyInfo} from "../components/notification/ToastNotification.jsx";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";

// Giả lập các icon - trong dự án thực tế sẽ import từ thư viện icon
const PersonIcon = () => <span role="img" aria-label="person">👤</span>;
const LockIcon = () => <span role="img" aria-label="lock">🔒</span>;
const VisibilityIcon = () => <span role="img" aria-label="show">👁️</span>;
const VisibilityOffIcon = () => <span role="img" aria-label="hide">🔍</span>;

const fadeIn = keyframes(`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`);

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    animation: `${fadeIn} 0.5s ease-in-out`,
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
}));

const LoginContainer = styled(Stack)(({theme}) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: 0,
        inset: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.4,
    },
}));

const StyledButton = styled(Button)(({theme}) => ({
    borderRadius: '8px',
    padding: '12px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    background: 'linear-gradient(90deg, #2988BC 0%, #2F496E 100%)',
    '&:hover': {
        background: 'linear-gradient(90deg, #2F496E 0%, #2988BC 100%)',
    },
    transition: 'all 0.3s ease',
}));

const Logo = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    '& svg': {
        width: 40,
        height: 40,
        marginRight: theme.spacing(1),
    },
}));

const Login = () => {
    const [userNameError, setUserNameError] = React.useState(false);
    const [userNameErrorMess, setUserNameErrorMess] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userNameError || passwordError) {
            return;
        }
        const data = new FormData(event.currentTarget);
        try {
            setIsLoading(true);
            console.log(data);
            notifyInfo('Đang đăng nhập...');
            // Mô phỏng thời gian đăng nhập
            setTimeout(() => {
                notifySuccess('Đăng nhập thành công!');
                navigate('/dashboard');
            }, 2000);
        } catch (e) {
            notifyError(e.message || 'Đăng nhập thất bại');
            console.log(e.message);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    };

    const handleSuccess = (response) => {
        console.log("Login Success:", response);
        // Gửi response.credentials đến backend để xác thực
    };

    const handleFailure = (error) => {
        console.error("Login Failed:", error);
    };

    const validateInputs = () => {
        const username = document.getElementById('username');
        const password = document.getElementById('password');

        let isValid = true;

        if (!username.value) {
            setUserNameError(true);
            setUserNameErrorMess('Tên đăng nhập không được để trống!');
            isValid = false;
        } else {
            setUserNameError(false);
            setUserNameErrorMess('');
        }

        if (!password.value) {
            setPasswordError(true);
            setPasswordErrorMessage('Mật khẩu không được để trống!');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    return (
        <GoogleOAuthProvider clientId="786437425572-b93mumbqt5jlsrn0sf30rfblvlrqcfsf.apps.googleusercontent.com">
            <CssBaseline enableColorScheme/>
            <LoginContainer direction="column" justifyContent="center" alignItems="center">
                {isLoading && <Loading/>}
                <Card variant="outlined">
                    <Logo>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 8H5V19H19V8Z" stroke="#2988BC" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M16 3L12 8L8 3" stroke="#2988BC" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M9 13H15" stroke="#2988BC" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M9 16H15" stroke="#2988BC" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: '#2988BC',
                                fontSize: 'clamp(1.5rem, 10vw, 1.8rem)'
                            }}
                        >
                            LuxStay
                        </Typography>
                    </Logo>

                    <Typography
                        component="h2"
                        variant="h5"
                        sx={{
                            width: '100%',
                            fontSize: 'clamp(1.5rem, 8vw, 1.8rem)',
                            textAlign: 'center',
                            fontWeight: 600,
                            marginBottom: 2,
                            color: '#333'
                        }}
                    >
                        Đăng nhập
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            textAlign: 'center',
                            marginBottom: 3,
                            fontSize: '0.9rem'
                        }}
                    >
                        Đăng nhập để tận hưởng những trải nghiệm đặt phòng tốt nhất
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2.5,
                        }}
                    >
                        <FormControl>
                            <TextField
                                error={userNameError}
                                helperText={userNameErrorMess}
                                label="Tên đăng nhập"
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Nhập tên đăng nhập của bạn"
                                autoComplete="username"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={userNameError ? 'error' : 'primary'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon/>
                                        </InputAdornment>
                                    ),
                                    sx: {borderRadius: '8px'}
                                }}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                label="Mật khẩu"
                                name="password"
                                placeholder="••••••"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: {borderRadius: '8px'}
                                }}
                            />
                        </FormControl>

                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary"/>}
                                label={<Typography variant="body2">Ghi nhớ đăng nhập</Typography>}
                            />
                            <Link
                                component="button"
                                type="button"
                                onClick={handleClickOpen}
                                variant="body2"
                                sx={{color: '#2988BC', fontWeight: 500}}
                            >
                                Quên mật khẩu?
                            </Link>
                        </Box>

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            Đăng nhập
                        </StyledButton>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{mt: 1}}
                        >
                            Chưa có tài khoản?{' '}
                            <Link
                                href="/register"
                                variant="body2"
                                sx={{color: '#2988BC', fontWeight: 600}}
                            >
                                Đăng ký ngay
                            </Link>
                        </Typography>

                        <Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>
                            <Box sx={{flex: 1, height: '1px', bgcolor: 'divider'}}/>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{mx: 2}}
                            >
                                hoặc
                            </Typography>
                            <Box sx={{flex: 1, height: '1px', bgcolor: 'divider'}}/>
                        </Box>

                        <Box sx={{display: 'flex', gap: 1, mt: 1}}>
                            <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    borderRadius: '8px',
                                    py: 1,
                                    textTransform: 'none',
                                    borderColor: '#E4E4E4',
                                    color: '#333'
                                }}
                            >
                                Facebook
                            </Button>
                        </Box>
                    </Box>
                </Card>

                <Typography
                    variant="body2"
                    color="white"
                    align="center"
                    sx={{mt: 4, opacity: 0.8, zIndex: 1}}
                >
                    © 2025 LuxStay. Tất cả các quyền được bảo lưu.
                </Typography>
            </LoginContainer>
        </GoogleOAuthProvider>
    );
};

export default Login;