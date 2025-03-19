import Box from '@mui/material/Box';
import * as React from "react";
import { Typography, useTheme } from "@mui/material";
import { keyframes } from '@mui/system';

// Hiệu ứng nhảy
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
`;

// Hiệu ứng đổi màu
const colorChange = keyframes`
  0% { background-color: #4285F4; }
  25% { background-color: #EA4335; }
  50% { background-color: #FBBC05; }
  75% { background-color: #34A853; }
  100% { background-color: #4285F4; }
`;

// Hiệu ứng fade
const fade = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
`;

// Hiệu ứng rotation 
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Hiệu ứng rotation 3D X
const rotateX = keyframes`
  0% { transform: rotateX(0); }
  100% { transform: rotateX(360deg); }
`;

// Hiệu ứng rotation 3D Y
const rotateY = keyframes`
  0% { transform: rotateY(0); }
  100% { transform: rotateY(360deg); }
`;

// Hiệu ứng rotation 3D complex
const rotate3D = keyframes`
  0% { transform: rotate3d(1, 1, 1, 0deg); }
  100% { transform: rotate3d(1, 1, 1, 360deg); }
`;

// Hiệu ứng pulse glow 3D
const pulseGlow3D = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7),
                inset 0 0 20px rgba(255, 255, 255, 0.5);
    transform: scale3d(1, 1, 1);
  }
  50% {
    box-shadow: 0 0 30px 10px rgba(66, 133, 244, 0.3),
                inset 0 0 15px rgba(255, 255, 255, 0.8);
    transform: scale3d(1.1, 1.1, 1.1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0),
                inset 0 0 20px rgba(255, 255, 255, 0.5);
    transform: scale3d(1, 1, 1);
  }
`;

// Hiệu ứng wave
const wave = keyframes`
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-10px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(10px); }
`;

// Hiệu ứng ripple
const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

// Hiệu ứng pulse glow
const pulseGlow = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(66, 133, 244, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
  }
`;

// Hiệu ứng text reveal
const textReveal = keyframes`
  0% { 
    clip-path: inset(0 100% 0 0);
    opacity: 0.3;
  }
  100% { 
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }
`;

// Component Loading hoàn toàn mới
const Loading = ({ 
    fullScreen = true, 
    size = 20, 
    color = "#4285F4", 
    text = "Đang tải...", 
    variant = "3d-cube"
}) => {
    const theme = useTheme();
    
    const getLoaderContent = () => {
        switch(variant) {
            case "dots":
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {[0, 1, 2].map((index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: size,
                                    height: size,
                                    margin: '0 4px',
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    animation: `${bounce} 1.4s infinite ease-in-out both`,
                                    animationDelay: `${index * 0.16}s`,
                                    boxShadow: `0 0 10px ${color}`,
                                }}
                            />
                        ))}
                    </Box>
                );
                
            case "spinner":
                return (
                    <Box
                        sx={{
                            width: size * 3,
                            height: size * 3,
                            borderRadius: '50%',
                            border: `${size/4}px solid rgba(255, 255, 255, 0.2)`,
                            borderTop: `${size/4}px solid ${color}`,
                            animation: `${rotate} 1s linear infinite`,
                            boxShadow: `0 0 15px rgba(0, 0, 0, 0.2)`,
                        }}
                    />
                );
                
            case "wave":
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', height: size * 3 }}>
                        {[0, 1, 2, 3, 4].map((index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: size / 2,
                                    height: size * 1.5,
                                    margin: '0 2px',
                                    borderRadius: '6px',
                                    background: `linear-gradient(to bottom, ${color}, ${color}AA)`,
                                    animation: `${wave} 1.2s infinite ease-in-out`,
                                    animationDelay: `${index * 0.1}s`,
                                    boxShadow: `0 0 8px ${color}66`,
                                }}
                            />
                        ))}
                    </Box>
                );
                
            case "cube":
                return (
                    <Box sx={{ position: 'relative', width: size * 3, height: size * 3 }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                border: `${size/8}px solid ${color}`,
                                animation: `${rotate} 1.5s infinite linear`,
                                boxShadow: `0 0 10px ${color}99, inset 0 0 10px ${color}66`,
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                border: `${size/8}px solid ${color}`,
                                animation: `${rotate} 1.5s infinite linear`,
                                animationDelay: '-0.75s',
                                transform: 'rotate(45deg)',
                                boxShadow: `0 0 10px ${color}99, inset 0 0 10px ${color}66`,
                            }}
                        />
                    </Box>
                );
                
            case "progress":
                return (
                    <Box 
                        sx={{ 
                            position: 'relative', 
                            width: size * 8, 
                            height: size / 2, 
                            overflow: 'hidden', 
                            borderRadius: size,
                            background: 'rgba(255, 255, 255, 0.1)',
                            boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '30%',
                                backgroundImage: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                                animation: `${fade} 1.5s infinite, ${colorChange} 6s infinite`,
                                boxShadow: `0 0 15px ${color}`,
                            }}
                        />
                    </Box>
                );
            
            case "ripple":
                return (
                    <Box sx={{ position: 'relative', width: size * 4, height: size * 4 }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                backgroundColor: `${color}33`,
                                animation: `${ripple} 1.5s infinite cubic-bezier(0.65, 0, 0.35, 1)`,
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                backgroundColor: `${color}33`,
                                animation: `${ripple} 1.5s infinite cubic-bezier(0.65, 0, 0.35, 1)`,
                                animationDelay: '0.5s',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: size,
                                height: size,
                                borderRadius: '50%',
                                backgroundColor: color,
                                boxShadow: `0 0 10px ${color}`,
                                animation: `${pulseGlow} 2s infinite`,
                            }}
                        />
                    </Box>
                );
                
            case "infinity":
                return (
                    <Box sx={{ position: 'relative', width: size * 5, height: size * 2.5, perspective: '500px' }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                left: 0,
                                top: 0,
                                borderRadius: size * 2,
                                backgroundImage: `linear-gradient(45deg, transparent, ${color}66, transparent)`,
                                animation: `${rotate} 3s linear infinite`,
                                boxShadow: `0 0 20px ${color}33`,
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                left: 0,
                                top: 0,
                                borderRadius: size * 2,
                                backgroundImage: `linear-gradient(135deg, transparent, ${color}66, transparent)`,
                                animation: `${rotate} 3s linear infinite`,
                                animationDelay: '-1.5s',
                                boxShadow: `0 0 20px ${color}33`,
                            }}
                        />
                    </Box>
                );
                
            case "3d-sphere":
                return (
                    <Box 
                        sx={{ 
                            position: 'relative', 
                            width: size * 3.5, 
                            height: size * 3.5,
                            perspective: '800px',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: `radial-gradient(circle at 30% 30%, white, ${color})`,
                                boxShadow: `0 0 30px ${color}88`,
                                animation: `${pulseGlow3D} 2.5s infinite ease-in-out`,
                                backfaceVisibility: 'visible',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '80%',
                                height: '80%',
                                top: '10%',
                                left: '10%',
                                borderRadius: '50%',
                                border: `2px solid rgba(255, 255, 255, 0.2)`,
                                animation: `${rotateX} 5s infinite linear`,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '0%',
                                    left: '50%',
                                    width: size / 2.5,
                                    height: size / 2.5,
                                    borderRadius: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'white',
                                    boxShadow: '0 0 10px white',
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '90%',
                                height: '90%',
                                top: '5%',
                                left: '5%',
                                borderRadius: '50%',
                                border: `1px solid rgba(255, 255, 255, 0.15)`,
                                animation: `${rotateY} 4s infinite linear`,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '0%',
                                    width: size / 2.5,
                                    height: size / 2.5,
                                    borderRadius: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'white',
                                    boxShadow: '0 0 10px white',
                                }}
                            />
                        </Box>
                    </Box>
                );

            case "3d-cube":
                return (
                    <Box 
                        sx={{ 
                            position: 'relative', 
                            width: size * 3, 
                            height: size * 3,
                            perspective: '800px',
                            transformStyle: 'preserve-3d',
                            animation: `${rotate3D} 6s infinite linear`,
                        }}
                    >
                        {/* Front */}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                transform: 'translateZ(calc(1.5 * ' + size + 'px))',
                                boxShadow: `0 0 15px ${color}66`,
                                background: `linear-gradient(45deg, ${color}AA, ${color}DD)`,
                            }}
                        />
                        {/* Back */}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                transform: 'translateZ(calc(-1.5 * ' + size + 'px)) rotateY(180deg)',
                                boxShadow: `0 0 15px ${color}66`,
                                background: `linear-gradient(45deg, ${color}DD, ${color}AA)`,
                            }}
                        />
                        {/* Left */}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: `calc(3 * ${size}px)`,
                                height: '100%',
                                transform: 'rotateY(-90deg) translateZ(calc(1.5 * ' + size + 'px))',
                                boxShadow: `0 0 15px ${color}66`,
                                background: `linear-gradient(to bottom, ${color}DD, ${color}AA)`,
                            }}
                        />
                        {/* Right */}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: `calc(3 * ${size}px)`,
                                height: '100%',
                                transform: 'rotateY(90deg) translateZ(calc(1.5 * ' + size + 'px))',
                                boxShadow: `0 0 15px ${color}66`,
                                background: `linear-gradient(to bottom, ${color}AA, ${color}DD)`,
                            }}
                        />
                        {/* Top */}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: `calc(3 * ${size}px)`,
                                transform: 'rotateX(90deg) translateZ(calc(1.5 * ' + size + 'px))',
                                boxShadow: `0 0 15px ${color}66`,
                                background: `linear-gradient(to right, ${color}CC, ${color}EE)`,
                            }}
                        />
                        {/* Bottom */}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: `calc(3 * ${size}px)`,
                                transform: 'rotateX(-90deg) translateZ(calc(1.5 * ' + size + 'px))',
                                boxShadow: `0 0 15px ${color}66`,
                                background: `linear-gradient(to left, ${color}CC, ${color}EE)`,
                            }}
                        />
                    </Box>
                );

            case "3d-ring":
                return (
                    <Box 
                        sx={{ 
                            position: 'relative', 
                            width: size * 4, 
                            height: size * 4,
                            perspective: '1000px',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {[...Array(12)].map((_, i) => (
                            <Box
                                key={i}
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    border: 'none',
                                    backgroundImage: `linear-gradient(${i * 30}deg, transparent 40%, ${color}${(i % 5 === 0) ? 'FF' : '99'}, transparent 60%)`,
                                    transform: `rotateY(${i * 30}deg) rotateX(70deg)`,
                                    animation: `${rotate} ${4 + i * 0.2}s infinite linear ${i * 0.1}s`,
                                    boxShadow: (i % 2 === 0) ? `0 0 15px ${color}AA` : 'none',
                                }}
                            />
                        ))}
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '30%',
                                height: '30%',
                                top: '35%',
                                left: '35%',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                boxShadow: `0 0 40px ${color}, 0 0 20px white`,
                                animation: `${pulseGlow} 2s infinite`,
                            }}
                        />
                    </Box>
                );
                
            case "3d-flip":
                return (
                    <Box 
                        sx={{ 
                            position: 'relative', 
                            width: size * 4, 
                            height: size * 4, 
                            transformStyle: 'preserve-3d',
                            perspective: '1200px',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                transformStyle: 'preserve-3d',
                                animation: `${rotate3D} 4s infinite linear`,
                            }}
                        >
                            {/* Front */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `linear-gradient(135deg, ${color}DD, ${color}88)`,
                                    transform: 'translateZ(calc(' + size + 'px))',
                                    boxShadow: `0 0 20px ${color}66`,
                                    backfaceVisibility: 'hidden',
                                }}
                            />
                            {/* Back */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `linear-gradient(135deg, ${color}88, ${color}DD)`,
                                    transform: 'translateZ(calc(-1 * ' + size + 'px)) rotateY(180deg)',
                                    boxShadow: `0 0 20px ${color}66`,
                                    backfaceVisibility: 'hidden',
                                }}
                            />
                            {/* Right */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: `calc(2 * ${size}px)`,
                                    height: '100%',
                                    backgroundImage: `linear-gradient(135deg, ${color}AA, ${color}99)`,
                                    transform: 'rotateY(90deg) translateZ(calc(' + size * 3 + 'px))',
                                    boxShadow: `0 0 20px ${color}66`,
                                    backfaceVisibility: 'hidden',
                                }}
                            />
                            {/* Left */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: `calc(2 * ${size}px)`,
                                    height: '100%',
                                    backgroundImage: `linear-gradient(135deg, ${color}99, ${color}AA)`,
                                    transform: 'rotateY(-90deg) translateZ(calc(' + size + 'px))',
                                    boxShadow: `0 0 20px ${color}66`,
                                    backfaceVisibility: 'hidden',
                                }}
                            />
                            {/* Top */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: `calc(2 * ${size}px)`,
                                    backgroundImage: `linear-gradient(135deg, ${color}CC, ${color}88)`,
                                    transform: 'rotateX(90deg) translateZ(calc(' + size * 3 + 'px))',
                                    boxShadow: `0 0 20px ${color}66`,
                                    backfaceVisibility: 'hidden',
                                }}
                            />
                            {/* Bottom */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: `calc(2 * ${size}px)`,
                                    backgroundImage: `linear-gradient(135deg, ${color}88, ${color}CC)`,
                                    transform: 'rotateX(-90deg) translateZ(calc(' + size + 'px))',
                                    boxShadow: `0 0 20px ${color}66`,
                                    backfaceVisibility: 'hidden',
                                }}
                            />
                        </Box>
                    </Box>
                );
                
            default:
                return getLoaderContent("3d-cube");
        }
    };

    const getContainer = (content) => {
        // Nếu fullScreen, hiển thị overlay toàn màn hình
        if (fullScreen) {
            return (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 9999,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3,
                        }}
                    >
                        {content}
                        
                        {text && (
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: 'white', 
                                    fontWeight: 500,
                                    letterSpacing: '0.5px',
                                    animation: `${textReveal} 1s forwards`,
                                    textShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                {text}
                            </Typography>
                        )}
                    </Box>
                </Box>
            );
        }
        
        // Inline loading
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                {content}
                
                {text && (
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: 'text.secondary',
                            fontWeight: 500,
                            animation: `${textReveal} 0.8s forwards`,
                        }}
                    >
                        {text}
                    </Typography>
                )}
            </Box>
        );
    };

    return getContainer(getLoaderContent());
};

export default Loading;
