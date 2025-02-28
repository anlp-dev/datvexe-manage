import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";

const RoleDialog = ({ open, onClose, onSave, selectedRole }) => {
    const [roleData, setRoleData] = useState({ name: "", code: "", description: "", color: "#1976d2" });

    useEffect(() => {
        if (selectedRole) {
            setRoleData({
                name: selectedRole.name,
                code: selectedRole.code,
                description: selectedRole.description,
                color: selectedRole.color || "#1976d2"
            });
        } else {
            setRoleData({ name: "", code: "", description: "", color: "#1976d2" });
        }
    }, [selectedRole]);

    const handleChange = (e) => {
        setRoleData({ ...roleData, [e.target.name]: e.target.value });
    };

    const handleColorChange = (color) => {
        setRoleData({ ...roleData, color });
    };

    const handleSubmit = () => {
        onSave(roleData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{selectedRole ? "Chỉnh sửa Role" : "Thêm mới Role"}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Tên Role"
                    name="name"
                    value={roleData.name}
                    onChange={handleChange}
                    margin="dense"
                />
                <TextField
                    fullWidth
                    label="Mã Role"
                    name="code"
                    value={roleData.code}
                    onChange={handleChange}
                    margin="dense"
                    disabled={selectedRole ? true : false}
                />
                <TextField
                    fullWidth
                    label="Mô tả"
                    name="description"
                    value={roleData.description}
                    onChange={handleChange}
                    margin="dense"
                    multiline
                    rows={3}
                />

                <Box mt={2}>
                    <MuiColorInput
                        fullWidth
                        label="Màu sắc"
                        value={roleData.color}
                        onChange={handleColorChange}
                        format="hex"
                        margin="dense"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Hủy</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                    {selectedRole ? "Lưu thay đổi" : "Thêm mới"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoleDialog;