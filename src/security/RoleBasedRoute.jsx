import { Navigate } from "react-router-dom";

const RoleBasedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem("role");

    if (!role) {
        return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/403" />;
    }

    return children;
};

export default RoleBasedRoute;
