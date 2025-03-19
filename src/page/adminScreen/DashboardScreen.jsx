import * as React from 'react';

import Box from '@mui/material/Box';
import SideMenu from '../../components/adminScreen/SideMenu';
import HomeAdmin from "./HomeAdmin.jsx";
import {Route, Routes, useNavigate} from "react-router-dom";
import LogRequest from "./LogRequest.jsx";
import ManageUser from "./UserManagement.jsx";
import RoleScreen from "./RoleScreen.jsx";
import RoleBasedRoute from "../../security/RoleBasedRoute.jsx";
import SystemConfig from "./SystemScreen.jsx";
import BusManagementDashboard from "./BusManager.jsx";
import TicketManagementDashboard from "./TicketManager.jsx";
import VehicleManagement from "./VehicleManagement.jsx";
import PaymentManagementDashboard from "./PaymentManagement.jsx";
import ReportDashboard from "./ReportDashboard.jsx";
import DiscountManagement from "./DiscountManagement.jsx";
import ChatInterface from "./ChatInterface.jsx";


export default function Dashboard() {
    const navigate = useNavigate();

    const handleMenuItemClick = (path) => {
        navigate(`/admin/${path}`);
    };

    return (
        <Box sx={{display: 'flex'}}>
            <SideMenu onMenuItemClick={handleMenuItemClick}/>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Routes>
                    <Route path="/homeAdmin" element={<HomeAdmin/>}/>
                    <Route path="/logRequest" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_ADMIN_ONLY"]}>
                            <LogRequest/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/manageUser" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_MANAGER"]}>
                            <ManageUser/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/role" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_ADMIN_ONLY"]}>
                            <RoleScreen/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/system" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_ADMIN_ONLY"]}>
                            <SystemConfig/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/busManager" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_MANAGER"]}>
                            <BusManagementDashboard/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/ticket" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_MANAGER"]}>
                            <TicketManagementDashboard/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/vehicle" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_MANAGER"]}>
                            <VehicleManagement/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/payment" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_MANAGER"]}>
                            <PaymentManagementDashboard/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/chat" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_MANAGER"]}>
                            <ChatInterface/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/report" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_MANAGER"]}>
                            <ReportDashboard/>
                        </RoleBasedRoute>
                    }/>
                    <Route path="/discount" element={
                        <RoleBasedRoute allowedRoles={["SUPER_ADMIN", "SUPER_MANAGER"]}>
                            <DiscountManagement/>
                        </RoleBasedRoute>
                    }/>
                </Routes>
            </Box>
        </Box>
    );
}
