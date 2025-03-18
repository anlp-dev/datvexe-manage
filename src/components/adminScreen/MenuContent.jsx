// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import SettingsSystemDaydreamIcon from '@mui/icons-material/SettingsSystemDaydream';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import PaymentIcon from '@mui/icons-material/Payment';
import FlagIcon from '@mui/icons-material/Flag';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {useLocation} from "react-router-dom";
import { useEffect, useState } from 'react';

const getMenuItems = (userRole) => {
    // Danh sách menu cơ bản
    const items = [
        {text: 'Trang chủ', icon: <HomeRoundedIcon/>, path: "homeAdmin", roles: ["SUPER_ADMIN", "SUPER_MANAGER"]},
        {text: 'Thống kê request', icon: <AnalyticsRoundedIcon/>, path: "logRequest", roles: ["SUPER_ADMIN"]},
        {text: 'Quản trị người dùng', icon: <PeopleRoundedIcon/>, path: "manageUser", roles: ["SUPER_ADMIN", "SUPER_MANAGER"]},
        {text: 'Quản trị quyền', icon: <AssignmentRoundedIcon/>, path: "role", roles: ["SUPER_ADMIN"]},
        {text: 'Cấu hình hệ thống', icon: <SettingsSystemDaydreamIcon/>, path: "system", roles: ["SUPER_ADMIN"]},
        {text: 'Quản lý chuyến xe', icon: <DirectionsBusIcon/>, path: "busManager", roles: ["SUPER_ADMIN", "SUPER_MANAGER"]},
        {text: 'Quản lý vé', icon: <AirplaneTicketIcon/>, path: "ticket", roles: ["SUPER_ADMIN", "SUPER_MANAGER"]},
        {text: 'Quản lý xe', icon: <DepartureBoardIcon/>, path: "vehicle", roles: ["SUPER_ADMIN", "SUPER_MANAGER"]},
        {text: 'Quản lý thanh toán', icon: <PaymentIcon/>, path: "payment", roles: ["SUPER_ADMIN", "SUPER_MANAGER"]},
        {text: 'Quản lý mã giảm giá', icon: <LocalOfferIcon/>, path: "discount", roles: ["SUPER_ADMIN", "SUPER_MANAGER"]},
        {text: 'Báo cáo, thống kê', icon: <FlagIcon/>, path: "report", roles: ["SUPER_ADMIN", "SUPER_MANAGER"]},
    ];

    // Lọc các item dựa trên quyền của người dùng
    return items.filter(item => item.roles.includes(userRole));
};

const MenuContent = ({onMenuItemClick}) => {
    const location = useLocation();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const userRole = localStorage.getItem("role") || "";
        setMenuItems(getMenuItems(userRole));
    }, []);

    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {menuItems.map((item, index) => {
                    const isSelected = location.pathname === `/admin/${item.path}`;
                    return (
                        <ListItem key={index} disablePadding sx={{display: 'block'}}
                                  onClick={() => item.path && onMenuItemClick(item.path)}>
                            <ListItemButton selected={isSelected}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text}/>
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </Stack>
    );
}

export default MenuContent;
