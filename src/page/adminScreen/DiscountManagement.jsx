import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Box,
  Grid,
  Divider,
  Tooltip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as LocalOfferIcon,
  Percent as PercentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Loading from "../../components/loading/Loading";
import DiscountService from "../../services/DiscountService";
import { notifyError, notifySuccess } from "../../components/notification/ToastNotification";

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  overflow: "hidden",
  borderRadius: theme.spacing(2),
  width: "100%",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  },
}));

const StatsCard = styled(Paper)(({ theme, bgcolor }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: bgcolor,
  color: "#fff",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "30%",
    height: "100%",
    backgroundColor: alpha("#fff", 0.1),
    clipPath: "polygon(100% 0, 0 0, 100% 100%)",
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.spacing(3),
    backgroundColor: alpha(theme.palette.common.white, 0.9),
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    transition: "all 0.3s",
    "&:hover": {
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    },
    "&.Mui-focused": {
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
    },
  },
}));

const StyledAvatar = styled(Avatar)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  fontWeight: "bold",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: "8px 16px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
  },
}));

// Sample discount data
const initialDiscounts = [
  {
    id: 1,
    title: "Summer Sale",
    description: "Discount for summer season",
    percent: 20,
    quantity: 100,
    status: "01", // Active
    createdAt: new Date("2023-06-01").toISOString(),
    updatedAt: new Date("2023-06-10").toISOString(),
  },
  {
    id: 2,
    title: "New User",
    description: "Discount for new users",
    percent: 15,
    quantity: 50,
    status: "01", // Active
    createdAt: new Date("2023-05-15").toISOString(),
    updatedAt: null,
  },
  {
    id: 3,
    title: "Holiday Special",
    description: "Special discount for holidays",
    percent: 25,
    quantity: 30,
    status: "02", // Inactive
    createdAt: new Date("2023-04-20").toISOString(),
    updatedAt: new Date("2023-05-01").toISOString(),
  },
];

// Basic statistics
const statistics = {
  totalDiscounts: 3,
  activeDiscounts: 2,
  averageDiscount: 20,
};

const DiscountManagement = () => {
  const [discounts, setDiscounts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState({
    id: null,
    title: "",
    code: "",
    description: "",
    percent: 0,
    quantity: 0,
    status: "01",
    createdAt: null,
    updatedAt: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const res = await DiscountService.getAllDiscount();
      setDiscounts(res.data);
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered discounts
  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Open dialog for adding new discount
  const handleOpenAddDialog = () => {
    setCurrentDiscount({
      id: null,
      title: "",
      code: "",
      description: "",
      percent: 0,
      quantity: 0,
      status: "01",
      createdAt: null,
      updatedAt: null,
    });
    setEditMode(false);
    setOpenDialog(true);
  };

  // Open dialog for editing discount
  const handleOpenEditDialog = (discount) => {
    setCurrentDiscount({ ...discount });
    console.log(currentDiscount);
    setEditMode(true);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle input change in dialog
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDiscount({
      ...currentDiscount,
      [name]: value,
    });
  };

  // Handle percent slider change
  const handlePercentChange = (event, newValue) => {
    setCurrentDiscount({
      ...currentDiscount,
      percent: newValue,
    });
  };

  const handleSaveDiscount = async () => {
    if (editMode) {
      try{
        setIsLoading(true);
        let dataReq = {
          id: currentDiscount._id,
          percent: currentDiscount.percent,
          quantity: currentDiscount.quantity,
          status: currentDiscount.status,
        }
        const res = await DiscountService.updateDiscount(dataReq);
        if(res.status === 200){
          notifySuccess("Cập nhật mã giảm giá thành công");
          fetchDiscounts();
        }else{
          notifyError("Cập nhật mã giảm giá thất bại");
        }
      }catch(e){
        notifyError(e.message);
      }finally{
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await DiscountService.createDiscount(currentDiscount);
        if (res.status === 200) {
          notifySuccess("Thêm mã giảm giá thành công");
          fetchDiscounts();
        } else {
          notifyError("Thêm mã giảm giá thất bại");
        }
      } catch (e) {
        notifyError(e.message);
      } finally {
        setIsLoading(false);
      }
    }
    handleCloseDialog();
  };

  // Delete discount
  const handleDeleteDiscount = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn ngừng hoạt động mã giảm giá này?")) {
      try{
        const res = await DiscountService.deleteDiscount(id);
        if(res.status === 200){
          notifySuccess("Ngừng hoạt động mã giảm giá thành công");
          fetchDiscounts();
        }else{
          notifyError("Ngừng hoạt động mã giảm giá thất bại");
        }
      }catch(e){
        notifyError(e.message);
      }
    }
  };

  // Render status chip with appropriate color
  const renderStatusChip = (status) => {
    let color = "default";
    let icon = null;
    let label = "Unknown";

    switch (status) {
      case "01":
        color = "success";
        icon = <CheckCircleIcon fontSize="small" />;
        label = "Hoạt động";
        break;
      case "00":
        color = "default";
        icon = <CancelIcon fontSize="small" />;
        label = "Không hoạt động";
        break;
      default:
        color = "default";
        label = "Unknown";
    }

    return (
      <Chip
        label={label}
        color={color}
        size="small"
        icon={icon}
        sx={{
          borderRadius: "12px",
          fontWeight: 500,
          "& .MuiChip-label": { px: 1 },
        }}
      />
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container maxWidth={100}>
      {isLoading ? <Loading fullScreen={true} /> : ""}
      <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quản lý mã giảm giá
        </Typography>
      </Box>

      {/* Enhanced Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatsCard bgcolor="#3f51b5">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                Tổng số mã giảm giá
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {discounts.length}
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: alpha("#fff", 0.2),
                width: 56,
                height: 56,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            >
              <LocalOfferIcon fontSize="large" />
            </Avatar>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard bgcolor="#4caf50">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                Mã giảm giá đang hoạt động
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {
                  discounts.filter((discount) => discount.status === "01")
                    .length
                }
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: alpha("#fff", 0.2),
                width: 56,
                height: 56,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            >
              <CheckCircleIcon fontSize="large" />
            </Avatar>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatsCard bgcolor="#ff9800">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                Phần trăm giảm giá trung bình
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {statistics.averageDiscount}%
              </Typography>
            </Box>
            <Avatar
              sx={{
                bgcolor: alpha("#fff", 0.2),
                width: 56,
                height: 56,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
            >
              <PercentIcon fontSize="large" />
            </Avatar>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Enhanced Discount Management Table */}
      <StyledCard sx={{ mt: 10 }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Danh sách mã giảm giá
            </Typography>
          }
          action={
            <ActionButton
              variant="contained"
              startIcon={<AddIcon />}
              color="primary"
              onClick={handleOpenAddDialog}
            >
              Thêm mã giảm giá
            </ActionButton>
          }
          sx={{ px: 3, py: 2.5 }}
        />
        <Divider />
        <CardContent sx={{ p: 3 }}>
          {/* Enhanced Search Bar */}
          <Box sx={{ display: "flex", mb: 4 }}>
            <SearchField
              size="small"
              placeholder="Tìm kiếm mã giảm giá..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                ),
              }}
              fullWidth
              sx={{ mr: 2, maxWidth: 300 }}
            />
            <Button
              startIcon={<FilterListIcon />}
              variant="outlined"
              sx={{
                borderRadius: 3,
                px: 2,
                borderWidth: 1.5,
              }}
            >
              Lọc
            </Button>
          </Box>

          {/* Enhanced Discounts Table */}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              mb: 2,
              width: "100%",
            }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phần trăm</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Số lượng</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Ngày tạo</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Cập nhật lần cuối
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDiscounts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((discount) => (
                    <TableRow
                      key={discount._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: alpha("#3f51b5", 0.04),
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <StyledAvatar
                            sx={{ mr: 2 }}
                            color={
                              discount.status === "01" ? "#4caf50" : "#9e9e9e"
                            }
                          >
                            <LocalOfferIcon fontSize="small" />
                          </StyledAvatar>
                          <Typography fontWeight={500}>
                            {discount.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{discount.code}</TableCell>
                      <TableCell>{discount.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${discount.percent}%`}
                          color="primary"
                          size="small"
                          sx={{
                            borderRadius: "12px",
                            fontWeight: 500,
                            "& .MuiChip-label": { px: 1 },
                          }}
                        />
                      </TableCell>
                      <TableCell>{discount.quantity}</TableCell>
                      <TableCell>{renderStatusChip(discount.status)}</TableCell>
                      <TableCell>{formatDate(discount.createdAt)}</TableCell>
                      <TableCell>{formatDate(discount.updatedAt)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            sx={{
                              mr: 1,
                              color: "primary.main",
                              bgcolor: alpha("#3f51b5", 0.1),
                              "&:hover": {
                                bgcolor: alpha("#3f51b5", 0.2),
                              },
                            }}
                            onClick={() => handleOpenEditDialog(discount)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            sx={{
                              color: "error.main",
                              bgcolor: alpha("#f44336", 0.1),
                              "&:hover": {
                                bgcolor: alpha("#f44336", 0.2),
                              },
                            }}
                            onClick={() => handleDeleteDiscount(discount._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredDiscounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <LocalOfferIcon
                          sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                        />
                        <Typography variant="subtitle1" color="text.secondary">
                          Không tìm thấy mã giảm giá nào
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDiscounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Mã giảm giá mỗi trang:"
            sx={{
              ".MuiTablePagination-select": {
                borderRadius: 2,
                mr: 1,
              },
            }}
          />
        </CardContent>
      </StyledCard>

      {/* Add/Edit Discount Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              name="title"
              label="Tiêu đề"
              fullWidth
              margin="normal"
              value={currentDiscount.title}
              onChange={handleInputChange}
              disabled={editMode}
              required
            />
            <TextField
              name="code"
              label="Code"
              fullWidth
              margin="normal"
              value={currentDiscount.code}
              onChange={handleInputChange}
              disabled={editMode}
              required
            />
            <TextField
              name="description"
              label="Mô tả"
              fullWidth
              margin="normal"
              value={currentDiscount.description}
              onChange={handleInputChange}
              required
              multiline
              disabled={editMode}
              rows={2}
            />
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography gutterBottom>
                Phần trăm giảm giá: {currentDiscount.percent}%
              </Typography>
              <Slider
                value={currentDiscount.percent}
                onChange={handlePercentChange}
                aria-labelledby="percent-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
              />
            </Box>
            <TextField
              name="quantity"
              label="Số lượng"
              type="number"
              fullWidth
              margin="normal"
              value={currentDiscount.quantity}
              onChange={handleInputChange}
              InputProps={{
                inputProps: { min: 0 },
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={currentDiscount.status}
                label="Trạng thái"
                onChange={handleInputChange}
                disabled={currentDiscount.status === "01"}
              >
                <MenuItem value="01">Hoạt động</MenuItem>
                <MenuItem value="00">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSaveDiscount}
            variant="contained"
            color="primary"
            disabled={!currentDiscount.title || !currentDiscount.description}
          >
            {editMode ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DiscountManagement;
