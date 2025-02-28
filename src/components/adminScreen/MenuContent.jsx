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
import {useLocation} from "react-router-dom";

const mainListItems = [
    {text: 'Trang chủ', icon: <HomeRoundedIcon/>, path: "homeAdmin"},
    {text: 'Thống kê request', icon: <AnalyticsRoundedIcon/>, path: "logRequest"},
    {text: 'Quản trị người dùng', icon: <PeopleRoundedIcon/>, path: "manageUser"},
    {text: 'Quản trị quyền', icon: <AssignmentRoundedIcon/>, path: "role"},
    {text: 'Cấu hình hệ thống', icon: <SettingsSystemDaydreamIcon/>, path: "system"},
    {text: 'Quản lý chuyến xe', icon: <DirectionsBusIcon/>, path: "busManager"},
    {text: 'Quản lý vé', icon: <AirplaneTicketIcon/>, path: "ticket"},
    {text: 'Quản lý xe', icon: <DepartureBoardIcon/>, path: "vehicle"},
    {text: 'Quản lý thanh toán', icon: <PaymentIcon/>, path: "payment"},
    {text: 'Báo cáo, thống kê', icon: <FlagIcon/>, path: "report"},
];

const secondaryListItems = [
    {text: 'Settings', icon: <SettingsRoundedIcon/>},
    {text: 'About', icon: <InfoRoundedIcon/>},
    {text: 'Feedback', icon: <HelpRoundedIcon/>},
];

const MenuContent = ({onMenuItemClick}) => {
    const location = useLocation();

    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                {mainListItems.map((item, index) => {
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
            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{display: 'block'}}>
                        <ListItemButton>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

export default MenuContent;