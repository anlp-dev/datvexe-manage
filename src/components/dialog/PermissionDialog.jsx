import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";

const PermissionDialog = ({ open, onClose, onSave, selectPermission }) => {
    const [permissionData, setPermissionData] = useState({ name: "", code: "", description: "" });

    useEffect(() => {
        if (selectPermission) {
            setPermissionData({
                name: selectPermission.name,
                code: selectPermission.code,
                description: selectPermission.description,
            });
        } else {
            setPermissionData({ name: "", code: "", description: "", color: "#1976d2" });
        }
    }, [selectPermission]);

    const handleChange = (e) => {
        setPermissionData({ ...permissionData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(permissionData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{selectPermission ? "Chỉnh sửa quyền" : "Thêm mới quyền"}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Tên quyền"
                    name="name"
                    value={permissionData.name}
                    onChange={handleChange}
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Mã quyền"
                    name="code"
                    value={permissionData.code}
                    onChange={handleChange}
                    margin="dense"
                    disabled={selectPermission ? true : false}
                />
                <TextField
                    fullWidth
                    label="Mô tả"
                    name="description"
                    value={permissionData.description}
                    onChange={handleChange}
                    margin="dense"
                    multiline
                    rows={3}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Hủy</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    {selectPermission ? "Lưu thay đổi" : "Thêm mới"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PermissionDialog;