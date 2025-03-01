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
import { keyframes, styled, alpha } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading/Loading.jsx";
import { notifySuccess, notifyError, notifyInfo } from "../components/notification/ToastNotification.jsx";
import AuthService from "../services/AuthService.jsx";
import { jwtDecode } from "jwt-decode";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Background images
// You would need to place these images in your public or assets folder
const backgroundImageUrl = '/assets/images/login-background.jpg'; // Replace with your actual image path
const overlayPattern = '/assets/images/pattern-overlay.png'; // Optional pattern overlay

// Animations
const fadeIn = keyframes(`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`);

const floatAnimation = keyframes(`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`);

// Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(6),
    gap: theme.spacing(3),
    margin: 'auto',
    animation: `${fadeIn} 0.8s ease-out`,
    [theme.breakpoints.up('sm')]: {
        maxWidth: '480px',
    },
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)',
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.85)} 100%)`,
    backdropFilter: 'blur(12px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    ...theme.applyStyles?.('dark', {
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.2)',
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
    }) || {},
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.95,
    },
    '&::after': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage: `
            linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.7)} 0%, ${alpha('#dc7a4e', 0.6)} 100%),
            url(${overlayPattern})
        `,
        backgroundSize: 'cover, 300px',
        backgroundBlendMode: 'normal, overlay',
        opacity: 0.9,
        ...theme.applyStyles?.('dark', {
            backgroundImage: `
                linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)} 0%, ${alpha('#f58766', 0.7)} 100%),
                url(${overlayPattern})
            `,
            opacity: 0.95,
        }) || {},
    }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    margin: theme.spacing(1),
    width: theme.spacing(8),
    height: theme.spacing(8),
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
    animation: `${floatAnimation} 6s ease-in-out infinite`,
}));

const AnimatedSecurityIcon = styled(SecurityIcon)(({ theme }) => ({
    position: 'absolute',
    fontSize: '220px',
    right: '-60px',
    bottom: '-60px',
    opacity: 0.07,
    color: theme.palette.common.white,
    transform: 'rotate(-15deg)',
    ...theme.applyStyles?.('dark', {
        opacity: 0.08,
    }) || {},
}));

// New component for animated particles
const ParticlesOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: 'hidden',
    pointerEvents: 'none',
    '& .particle': {
        position: 'absolute',
        borderRadius: '50%',
        background: alpha(theme.palette.primary.light, 0.6),
        boxShadow: `0 0 20px ${alpha(theme.palette.primary.light, 0.3)}`,
        opacity: 0.4,
    }
}));

const Login = () => {
    const [userNameError, setUserNameError] = React.useState(false);
    const [userNameErrorMess, setUserNameErrorMess] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const particlesRef = React.useRef(null);

    // Create animated particles effect
    React.useEffect(() => {
        if (!particlesRef.current) return;

        const container = particlesRef.current;
        const particleCount = 15;

        // Remove any existing particles
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Create new particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random size, position and animation duration
            const size = Math.random() * 8 + 2;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const animDuration = Math.random() * 20 + 10;
            const delay = Math.random() * 10;

            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            particle.style.animation = `${floatAnimation} ${animDuration}s ease-in-out ${delay}s infinite`;

            container.appendChild(particle);
        }

        return () => {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        };
    }, []);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleForgotPassword = () => {
        notifyInfo("Vui lòng liên hệ với quản trị viên hệ thống để đặt lại mật khẩu.");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateInputs()) {
            return;
        }
        const data = new FormData(event.currentTarget);
        try {
            setIsLoading(true);
            const resData = await AuthService.login(data);
            if (resData.status === 200) {
                const decode = jwtDecode(resData.data);
                localStorage.setItem("role", decode.role);
                if (decode.role === "SUPER_ADMIN") {
                    navigate("/admin/homeAdmin");
                    notifySuccess('Đăng nhập thành công!');
                } else {
                    navigate("/403");
                    notifyError("Bạn không có quyền truy cập!");
                }
            } else {
                notifyError("Đăng nhập thất bại!");
            }
        } catch (e) {
            notifyError(e.message);
        } finally {
            setIsLoading(false);
        }
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
        <>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="space-between">
                <ParticlesOverlay ref={particlesRef} />
                <AnimatedSecurityIcon />
                {isLoading && <Loading />}
                <Card variant="outlined">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 3,
                            position: 'relative',
                        }}
                    >
                        <StyledAvatar>
                            <LockOutlinedIcon fontSize="large" />
                        </StyledAvatar>
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                width: '100%',
                                fontSize: 'clamp(1.85rem, 7vw, 2.1rem)',
                                textAlign: 'center',
                                fontWeight: 700,
                                background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '-0.02em',
                                mt: 2,
                            }}
                        >
                            Quản Trị Hệ Thống
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            sx={{
                                mt: 1,
                                mb: 1,
                                textAlign: 'center',
                                fontWeight: 500,
                            }}
                        >
                            Đăng nhập để tiếp tục quản lý
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 3,
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
                                placeholder="Nhập tên đăng nhập"
                                autoComplete="username"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={userNameError ? 'error' : 'primary'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.6),
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: (theme) => alpha(theme.palette.background.paper, 1),
                                            boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                                        }
                                    }
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                label="Mật khẩu"
                                name="password"
                                placeholder="••••••••"
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
                                            <KeyIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.6),
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: (theme) => alpha(theme.palette.background.paper, 1),
                                            boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                                        }
                                    }
                                }}
                            />
                        </FormControl>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1
                        }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                        sx={{
                                            '&.Mui-checked': {
                                                color: (theme) => theme.palette.primary.main,
                                            }
                                        }}
                                    />
                                }
                                label={<Typography variant="body2">Ghi nhớ đăng nhập</Typography>}
                            />
                            <Link
                                component="button"
                                type="button"
                                onClick={handleForgotPassword}
                                variant="body2"
                                sx={{
                                    color: (theme) => theme.palette.primary.main,
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: (theme) => theme.palette.primary.dark,
                                        textDecoration: 'underline',
                                    }
                                }}
                            >
                                Quên mật khẩu?
                            </Link>
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disableElevation
                            color="primary"
                            onClick={validateInputs}
                            sx={{
                                mt: 2,
                                mb: 2,
                                py: 1.8,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                boxShadow: (theme) => `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                background: (theme) => `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: (theme) => `0 10px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            Đăng nhập
                        </Button>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mt: 2,
                        }}>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                align="center"
                                sx={{
                                    opacity: 0.8
                                }}
                            >
                                © {new Date().getFullYear()} Hệ thống quản trị
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </SignInContainer>
        </>
    );
};

export default Login;