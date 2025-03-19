import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem("role");

    if (!role) {
        return <Navigate to="/" />;
    }

    // SUPER_ADMIN có thể truy cập tất cả các trang
    if (role === "SUPER_ADMIN") {
        return children;
    }
    
    // SUPER_MANAGER có thể truy cập tất cả các trang quản lý
    if (role === "SUPER_MANAGER" && !allowedRoles.includes("SUPER_ADMIN_ONLY")) {
        return children;
    }

    // Kiểm tra nếu vai trò được cho phép
    if (allowedRoles.includes(role)) {
        return children;
    }

    // Nếu không có quyền truy cập, chuyển hướng đến trang 403
    return <Navigate to="/403" />;
};

export default RoleBasedRoute;
