import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import authService from '../services/AuthService.jsx';

const PrivateRoute = () => {
    const isAuthenticated = authService.isAuthenticated();

    return isAuthenticated ?
        <Outlet/>
        : <Navigate to="/"/>;
};

export default PrivateRoute;