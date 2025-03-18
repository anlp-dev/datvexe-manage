import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AdminService from "../../services/AdminService";
import { notifyError } from "../../components/notification/ToastNotification.jsx";

const UserDialog = ({ open, onClose, onSave, user, loading, roleData }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullname: "",
    phone: "",
    password: "",
    roleId: "",
    status: "01",
  });
  const [errors, setErrors] = useState({});
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
      });
    } else {
      setFormData({
        username: "",
        email: "",
        fullname: "",
        phone: "",
        password: "",
        roleId: "",
        status: "01",
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Họ và tên không được để trống";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.role) {
      newErrors.role = "Vui lòng chọn vai trò";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {user ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="username"
                label="Tên đăng nhập"
                fullWidth
                required
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={!!user}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="fullname"
                label="Họ và tên"
                fullWidth
                required
                value={formData.fullname}
                onChange={handleChange}
                error={!!errors.fullname}
                helperText={errors.fullname}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={user}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Số điện thoại"
                fullWidth
                required
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={user}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.roleId}>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="role"
                  value={formData.role || ""}
                  label="Vai trò"
                  onChange={handleChange}
                  required
                  disabled={loadingRoles}
                >
                  {roleData.map((role) => (
                    <MenuItem key={role._id} value={role.code}>
                      {role.name}
                    </MenuItem>
                  ))}{" "}
                </Select>
                {errors.roleId && (
                  <FormHelperText>{errors.roleId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Trạng thái"
                  onChange={handleChange}
                  disabled={!user}
                  required
                >
                  <MenuItem value="01">Hoạt động</MenuItem>
                  <MenuItem value="00">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <LoadingButton 
            type="submit" 
            variant="contained" 
            loading={loading}
            loadingIndicator={<CircularProgress color="inherit" size={20} thickness={4} />}
          >
            {user ? "Cập nhật" : "Thêm mới"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserDialog;
