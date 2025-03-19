import React, {useEffect, useState} from 'react';
import {
    Box, Typography, Paper, Grid, List, ListItem, ListItemText, ListItemButton,
    Checkbox, Divider, Button, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, IconButton, FormGroup, FormControlLabel, Chip, Avatar
} from '@mui/material';
import {
    Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon,
    Save as SaveIcon, AdminPanelSettings as AdminIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import {notifyError, notifySuccess} from "../../components/notification/ToastNotification.jsx";
import AdminService from "../../services/AdminService.jsx";
import Loading from "../../components/loading/Loading.jsx";
import RoleDialog from "../../components/dialog/RoleDialog.jsx";
import PermissionDialog from "../../components/dialog/PermissionDialog.jsx";
import {useNavigate} from "react-router-dom";

const RolePermissionManagement = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openDialogRole, setOpenDialogRole] = useState(false);
    const [openDialogPermission, setOpenDialogPermission] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [roles, permissions, rolePermissions] = await Promise.all([
                AdminService.getRole(),
                AdminService.getPermission(),
                AdminService.getRolePermission(),
            ]);
            if (roles.status === 200 && permissions.status === 200 && rolePermissions.status === 200) {
                setRoles(roles.data);
                setPermissions(permissions.data);
                setRolePermissions(rolePermissions.data)
            } else {
                notifyError("Error fetch data.")
            }
        } catch (e) {
            notifyError(e.message);
        } finally {
            setLoading(false);
        }
    }

    const handlePermissionChange = (permissionId) => {
        if (!selectedRole) return;
        setRolePermissions((prevPermissions) => {
            const rolePermissionIndex = prevPermissions.findIndex(rp => rp.roleId === selectedRole._id);

            if (rolePermissionIndex === -1) {
                // Nếu role chưa có quyền nào, tạo mới
                return [...prevPermissions, {roleId: selectedRole._id, permissionIds: [permissionId]}];
            }

            const updatedPermissions = [...prevPermissions];
            const currentPermissions = updatedPermissions[rolePermissionIndex].permissionIds;

            if (currentPermissions.includes(permissionId)) {
                updatedPermissions[rolePermissionIndex].permissionIds = currentPermissions.filter(id => id !== permissionId);
            } else {
                updatedPermissions[rolePermissionIndex].permissionIds.push(permissionId);
            }

            return updatedPermissions;
        });
    };

    const handleClose = () => {
        setOpenDialogRole(false);
        setOpenDialogPermission(false);
    }

    const handleOpenDialogRole = (role = null) => {
        setSelectedRole(role);
        setOpenDialogRole(true);
    }

    const handleOpenDialogPermission = (permission = null) => {
        setSelectedPermission(permission);
        setOpenDialogPermission(true);
    }

    const handleSaveRole = async (roleData) => {
        try {
            setIsLoading(true);
            if (selectedRole) {

            } else {
                const res = await AdminService.createRole(roleData);
                if (res.status === 200) {
                    notifySuccess(res.message);
                    fetchData();
                } else {
                    notifyError(res.message)
                }
            }
        } catch (e) {
            notifyError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSavePermission = async (permissionData) => {
        try {
            setIsLoading(true);
            if (selectedPermission) {

            } else {
                const res = await AdminService.createPermission(permissionData);
                if (res.status === 200) {
                    notifySuccess(res.message);
                    fetchData();
                } else {
                    notifyError(res.message)
                }
            }
        } catch (e) {
            notifyError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveRolePermission = async (roleId) => {
        try{
            setIsLoading(true);
            const rolePermission = rolePermissions.find(rp => rp.roleId === roleId);
            const dataReq = {id: rolePermission._id, permissions: rolePermission.permissionIds};
            const res = await AdminService.updateRolePermission(dataReq);
            if(res.status === 200){
                notifySuccess(res.message)
                fetchData();
            }else{
                notifyError(res.message);
            }
        }catch (e) {
            notifyError(e.message)
        }finally {
            setIsLoading(false)
        }
    }

    // Xử lý các thao tác với roles
    const handleRoleActions = {
        select: (role) => setSelectedRole(role),
    };

    const getPermissionCount = (roleId) => {
        const rolePermission = rolePermissions.find(rp => rp.roleId === roleId);
        return rolePermission ? rolePermission.permissionIds.length : 0;
    };

    return (
        <Box sx={{flexGrow: 1, minHeight: '100vh', p: {xs: 1, md: 3}}}>
            {loading && (
                <Loading fullScreen={true} />
            )}
            <Box sx={{mb: 5, display: 'flex', alignItems: 'center'}}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Quản lý Role và Permission
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Danh sách Role */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{minHeight: 500, borderRadius: 2, overflow: 'hidden'}}>
                        <Box sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                            <Typography variant="h6" sx={{fontWeight: 'bold', color: 'primary.main'}}>Roles</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon/>}
                                onClick={() => handleOpenDialogRole()}
                                size="small"
                                sx={{borderRadius: 8}}
                            >
                                Thêm Role
                            </Button>
                        </Box>
                        <List sx={{overflow: 'auto', height: '600px', pt: 0}}>
                            {roles.map((role) => (
                                <ListItem
                                    key={role._id}
                                    disablePadding
                                    divider
                                    secondaryAction={
                                        <Box>
                                            <Chip
                                                label={`${getPermissionCount(role._id)} quyền`}
                                                size="small"
                                                sx={{
                                                    mr: 1,
                                                    bgcolor: role.color,
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                sx={{color: 'primary.main'}}
                                                onClick={() => handleOpenDialogRole(role)}
                                            >
                                                <EditIcon fontSize="small"/>
                                            </IconButton> 
                                        </Box>
                                    }
                                    sx={{
                                        transition: 'all 0.2s',
                                        ':hover': {
                                            bgcolor: 'rgba(0,0,0,0.03)'
                                        }
                                    }}
                                >
                                    <ListItemButton
                                        selected={selectedRole && selectedRole?._id === role?._id}
                                        onClick={() => handleRoleActions.select(role)}
                                        sx={{
                                            pr: 16,
                                            py: 1.5,
                                            borderLeft: '4px solid',
                                            borderColor: selectedRole && selectedRole._id === role._id ? role.color : 'transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Avatar sx={{bgcolor: role.color, mr: 2, width: 36, height: 36}}>
                                            {role.name.charAt(0)}
                                        </Avatar>
                                        <ListItemText
                                            primary={<Typography fontWeight="bold">{role.name}</Typography>}
                                            secondary={role.description}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Danh sách Permission - Với thanh cuộn có chiều cao cố định */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{minHeight: 500, borderRadius: 2, overflow: 'hidden'}}>
                        <Box sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Avatar sx={{bgcolor: selectedRole?.color, mr: 2}}>
                                    {selectedRole?.name.charAt(0)}
                                </Avatar>
                                <Typography variant="h6" sx={{fontWeight: 'bold', color: 'primary.main'}}>
                                    {selectedRole ? (
                                        <>
                                            Permissions cho role: <span style={{ color: selectedRole.color }}>{selectedRole.name}</span>
                                        </>
                                    ) : (
                                        "Permissions"
                                    )}
                                </Typography>
                            </Box>
                            <Box>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<AddIcon/>}
                                    size="small"
                                    sx={{mr: 1, borderRadius: 8}}
                                    onClick={() => handleOpenDialogPermission()}
                                >
                                    Thêm Permission
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon/>}
                                    size="small"
                                    sx={{borderRadius: 8}}
                                    onClick={() => handleSaveRolePermission(selectedRole._id)}
                                >
                                    Lưu Thay Đổi
                                </Button>
                            </Box>
                        </Box>

                        {/* Permission List với chiều cao cố định và thanh cuộn */}
                        <Box sx={{
                            height: '600px', // Đặt chiều cao cố định ở đây
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <List sx={{
                                overflow: 'auto', // Thêm thanh cuộn
                                flexGrow: 1,
                                p: 0
                            }}>
                                {permissions.map(permission => {
                                    const rolePermission = rolePermissions.find(rp => rp.roleId === selectedRole?._id);
                                    const isChecked = rolePermission?.permissionIds?.includes(permission._id) || false;

                                    return (
                                        <ListItem
                                            key={permission._id}
                                            divider
                                            secondaryAction={
                                                <Box>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="edit"
                                                        sx={{ mr: 1, color: 'primary.main' }}
                                                        onClick={() => handleOpenDialogPermission(permission)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onChange={() => handlePermissionChange(permission._id)}
                                                    />
                                                }
                                                label={
                                                    <Box>
                                                        <Typography
                                                            variant="body1">{permission.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {permission.code}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ width: '100%' }}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Box>

                        <RoleDialog open={openDialogRole} selectedRole={selectedRole} onSave={handleSaveRole}
                                    onClose={handleClose}/>
                        <PermissionDialog open={openDialogPermission} selectPermission={selectedPermission}
                                          onSave={handleSavePermission} onClose={handleClose}/>
                    </Paper>
                </Grid>
            </Grid>

        </Box>
    );
};

export default RolePermissionManagement;
