// import apiConfig from "../configs/apiConfig.jsx";

const authService = {
    isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    },
}

export default authService;