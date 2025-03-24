import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Tooltip,
  Container,
  Snackbar,
  Alert,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  FileDownload as FileDownloadIcon,
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  ViewList as ViewListIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import PaymentService from "../../services/PaymentService";
import { formatCurrency } from "../../utils/format";
import Loading from "../../components/loading/Loading";
import {
  notifyError,
  notifySuccess,
} from "../../components/notification/ToastNotification.jsx";
import exportToExcel from "../../utils/exportReport.jsx";
import axios from "axios";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
  },
}));

const StatCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
  borderRadius: theme.spacing(2),
  backgroundColor: color,
  color: "#fff",
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px 0 rgba(0,0,0,0.1)",
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
  "& .MuiTableCell-head": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  "& .MuiTableRow-root:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function PaymentManagementDashboard() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Đang tải dữ liệu...");
  const [tabValue, setTabValue] = useState(0);
  const [dateFilter, setDateFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [revenueData, setRevenueData] = useState({
    daily: [],
    routes: [],
  });
  const [isClick, setIsClick] = useState(false);
  const [loadingPrint, setLoadingPrint] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Status mapping from API to UI
  const statusMapping = {
    payed: "Thành công",
    unpaid: "Chờ thanh toán",
    error: "Lỗi",
    cancelled: "Đã hoàn tiền",
  };

  // Payment method mapping from API to UI
  const paymentMethodMapping = {
    VNPay: "VNPay",
    MoMo: "MoMo",
    bank: "Chuyển khoản",
    cash: "Tiền mặt",
  };

  // Fetch payments data from API
  const fetchPayments = async () => {
    setIsLoading(true);
    setLoadingMessage("Đang tải dữ liệu thanh toán...");
    try {
      const result = await PaymentService.getPayments();
      if (result.status === 200) {
        const resData = result.data;
        const formattedPayments = resData.map((payment) => ({
          id: payment.id,
          bookingCode: payment.bookingCode,
          amount: payment.amount,
          paymentMethod:
            paymentMethodMapping[payment.paymentMethod] ||
            payment.paymentMethod,
          paymentDate: payment.paymentDate,
          status: statusMapping[payment.status] || payment.status,
          customerName: payment.customerName,
          routeName: payment.routeName,
        }));
        setPayments(formattedPayments);
      } else {
        showSnackbar(result.message, "error");
      }
    } catch (error) {
      showSnackbar("Không thể tải dữ liệu thanh toán", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate revenue statistics from payments data
  const calculateRevenueStats = () => {
    // Group by date
    const dailyStats = {};
    const routeStats = {};

    payments.forEach((payment) => {
      if (payment.status === "Thành công") {
        // Process daily stats
        const dateObj = new Date(payment.paymentDate);
        const dateStr = dateObj.toLocaleDateString("vi-VN");

        if (!dailyStats[dateStr]) {
          dailyStats[dateStr] = { date: dateStr, amount: 0, transactions: 0 };
        }
        dailyStats[dateStr].amount += payment.amount;
        dailyStats[dateStr].transactions += 1;

        // Process route stats
        if (!routeStats[payment.routeName]) {
          routeStats[payment.routeName] = {
            name: payment.routeName,
            amount: 0,
            transactions: 0,
          };
        }
        routeStats[payment.routeName].amount += payment.amount;
        routeStats[payment.routeName].transactions += 1;
      }
    });

    // Convert to arrays and sort by date (newest first)
    const dailyArray = Object.values(dailyStats)
      .sort((a, b) => {
        return (
          new Date(b.date.split("/").reverse().join("-")) -
          new Date(a.date.split("/").reverse().join("-"))
        );
      })
      .slice(0, 7); // Get last 7 days

    const routeArray = Object.values(routeStats);

    setRevenueData({
      daily: dailyArray,
      routes: routeArray,
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // Calculate stats when payments change
  useEffect(() => {
    if (payments.length > 0) {
      calculateRevenueStats();
    }
  }, [payments]);

  const totalRevenue = payments.reduce(
    (sum, payment) =>
      payment.status === "Thành công" ? sum + payment.amount : sum,
    0
  );
  const pendingPayments = payments.filter(
    (payment) => payment.status === "Chờ thanh toán"
  ).length;
  const errorPayments = payments.filter(
    (payment) => payment.status === "Lỗi"
  ).length;
  const successPayments = payments.filter(
    (payment) => payment.status === "Thành công"
  ).length;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleMethodFilterChange = (event) => {
    setMethodFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setReceiptOpen(true);
  };

  const handleDownloadFilePdf = async (payment) => {
    try {
      setIsLoading(true);
      setLoadingMessage("Đang tải xuống biên lai...");

      let dataReq = {
        datePay: payment.paymentDate,
        bookingCode: payment.bookingCode,
        customerName: payment.customerName,
        route: payment.routeName,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        totalPrice: payment.amount,
      };

      const response = await axios.post("http://localhost:9999/admin/payment/download-pdf", dataReq, {
        responseType: "blob", // Quan trọng: Nhận dữ liệu dưới dạng binary
      });

      if (response.status === 200) {
        console.log(response.data)
        const blob = new Blob([response.data], { type: "application/pdf" });
        console.log(blob)
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `hoa_don_${payment.bookingCode}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        notifyError("Tải xuống file thất bại!");
      }
    } catch (e) {
      console.error("Lỗi tải file:", e);
      notifyError("Tải xuống file thất bại!");
    } finally {
      setIsLoading(false);
    }
  };



  const handleCloseReceipt = () => {
    setReceiptOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const exportReport = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage("Đang xuất báo cáo...");
      
      // Format dữ liệu cho báo cáo
      const reportData = {
        summary: {
          totalRevenue,
          totalTransactions: payments.length,
          successfulPayments: successPayments,
          pendingPayments,
          errorPayments,
        },
        dailyRevenue: revenueData.daily.map((day) => ({
          date: day.date,
          transactions: day.transactions,
          amount: day.amount,
        })),
        routeRevenue: revenueData.routes.map((route) => ({
          name: route.name,
          transactions: route.transactions,
          amount: route.amount,
        })),
        transactions: filteredPayments.map((payment) => ({
          bookingCode: payment.bookingCode,
          customerName: payment.customerName,
          routeName: payment.routeName,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          paymentDate: payment.paymentDate,
          status: payment.status,
        })),
      };

      await exportToExcel(reportData);
      showSnackbar("Đã xuất báo cáo doanh thu thành công!", "success");
    } catch (error) {
      console.error("Export report error:", error);
      showSnackbar("Không thể xuất báo cáo", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Thành công":
        return "success";
      case "Lỗi":
        return "error";
      case "Chờ thanh toán":
        return "warning";
      case "Đã hoàn tiền":
        return "info";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch (e) {
      return dateString;
    }
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    let includePayment = true;

    if (methodFilter !== "all" && payment.paymentMethod !== methodFilter) {
      includePayment = false;
    }

    if (statusFilter !== "all" && payment.status !== statusFilter) {
      includePayment = false;
    }

    // Filter by date
    if (dateFilter !== "all") {
      const paymentDate = new Date(payment.paymentDate);
      const today = new Date();

      if (dateFilter === "today") {
        const isToday =
          paymentDate.getDate() === today.getDate() &&
          paymentDate.getMonth() === today.getMonth() &&
          paymentDate.getFullYear() === today.getFullYear();

        if (!isToday) includePayment = false;
      } else if (dateFilter === "yesterday") {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const isYesterday =
          paymentDate.getDate() === yesterday.getDate() &&
          paymentDate.getMonth() === yesterday.getMonth() &&
          paymentDate.getFullYear() === yesterday.getFullYear();

        if (!isYesterday) includePayment = false;
      } else if (dateFilter === "thisMonth") {
        const isThisMonth =
          paymentDate.getMonth() === today.getMonth() &&
          paymentDate.getFullYear() === today.getFullYear();

        if (!isThisMonth) includePayment = false;
      }
    }

    return includePayment;
  });

  const paymentMethods = Object.values(paymentMethodMapping);
  const statusOptions = Object.values(statusMapping);

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      {isLoading && <Loading fullScreen={true} message={loadingMessage} />}
      
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
          Quản lý Thanh toán
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard color="#3f51b5">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Tổng doanh thu
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {formatCurrency(totalRevenue)}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
                <Typography variant="caption">
                  Cập nhật theo thời gian thực
                </Typography>
              </Box>
            </Box>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
            >
              <MoneyIcon />
            </Avatar>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard color="#4caf50">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Thanh toán thành công
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {successPayments}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="caption">giao dịch</Typography>
              </Box>
            </Box>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
            >
              <ReceiptIcon />
            </Avatar>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard color="#ff9800">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Chờ thanh toán
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {pendingPayments}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="caption">cần xử lý</Typography>
              </Box>
            </Box>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
            >
              <MoneyIcon />
            </Avatar>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard color="#f44336">
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Giao dịch lỗi
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {errorPayments}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Typography variant="caption">cần kiểm tra</Typography>
              </Box>
            </Box>
            <Avatar
              sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}
            >
              <MoneyIcon />
            </Avatar>
          </StatCard>
        </Grid>
      </Grid>

      <StyledCard sx={{ mb: 4 }}>
        <CardHeader
          title="Quản lý Thanh toán & Báo cáo"
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => fetchPayments()}
                disabled={isLoading}
              >
                {isLoading ? "Đang tải..." : "Làm mới"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={exportReport}
                disabled={isLoading}
              >
                Xuất báo cáo
              </Button>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab icon={<ViewListIcon />} label="Lịch sử thanh toán" />
            <Tab icon={<PieChartIcon />} label="Báo cáo doanh thu" />
          </Tabs>

          {tabValue === 0 && (
            <>
              <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Ngày thanh toán</InputLabel>
                  <Select
                    value={dateFilter}
                    label="Ngày thanh toán"
                    onChange={handleDateFilterChange}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="today">Hôm nay</MenuItem>
                    <MenuItem value="yesterday">Hôm qua</MenuItem>
                    <MenuItem value="thisMonth">Tháng này</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Phương thức</InputLabel>
                  <Select
                    value={methodFilter}
                    label="Phương thức"
                    onChange={handleMethodFilterChange}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    {paymentMethods.map((method) => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Trạng thái"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <StyledTableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã đặt vé</TableCell>
                      <TableCell>Khách hàng</TableCell>
                      <TableCell>Tuyến xe</TableCell>
                      <TableCell>Số tiền</TableCell>
                      <TableCell>Phương thức</TableCell>
                      <TableCell>Ngày thanh toán</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id} hover>
                          <TableCell>{payment.bookingCode}</TableCell>
                          <TableCell>{payment.customerName}</TableCell>
                          <TableCell>{payment.routeName}</TableCell>
                          <TableCell>
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={payment.paymentMethod}
                              size="small"
                              color={
                                payment.paymentMethod === "VNPay"
                                  ? "primary"
                                  : payment.paymentMethod === "MoMo"
                                  ? "secondary"
                                  : payment.paymentMethod === "Chuyển khoản"
                                  ? "info"
                                  : "default"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {formatDate(payment.paymentDate)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={payment.status}
                              size="small"
                              color={getStatusChipColor(payment.status)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Xem biên lai">
                              <IconButton
                                color="primary"
                                onClick={() => handleViewReceipt(payment)}
                              >
                                <ReceiptIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          Không có dữ liệu thanh toán
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader
                    title="Doanh thu theo ngày"
                    subheader="Tổng hợp 7 ngày gần nhất"
                    avatar={
                      <Avatar sx={{ bgcolor: "#3f51b5" }}>
                        <DateRangeIcon />
                      </Avatar>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <StyledTableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Ngày</TableCell>
                            <TableCell>Số giao dịch</TableCell>
                            <TableCell>Doanh thu</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {revenueData.daily.length > 0 ? (
                            <>
                              {revenueData.daily.map((item, index) => (
                                <TableRow key={index} hover>
                                  <TableCell>{item.date}</TableCell>
                                  <TableCell>{item.transactions}</TableCell>
                                  <TableCell>
                                    {formatCurrency(item.amount)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow
                                sx={{ bgcolor: "rgba(63, 81, 181, 0.1)" }}
                              >
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Tổng
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  {revenueData.daily.reduce(
                                    (sum, item) => sum + item.transactions,
                                    0
                                  )}
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  {formatCurrency(revenueData.daily
                                    .reduce(
                                      (sum, item) => sum + item.amount,
                                      0
                                    )
                                  )}
                                </TableCell>
                              </TableRow>
                            </>
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                Không có dữ liệu doanh thu
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </StyledTableContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader
                    title="Doanh thu theo tuyến xe"
                    subheader="Trong tháng hiện tại"
                    avatar={
                      <Avatar sx={{ bgcolor: "#f50057" }}>
                        <PieChartIcon />
                      </Avatar>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <StyledTableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Tuyến xe</TableCell>
                            <TableCell>Số giao dịch</TableCell>
                            <TableCell>Doanh thu</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {revenueData.routes.length > 0 ? (
                            <>
                              {revenueData.routes.map((item, index) => (
                                <TableRow key={index} hover>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.transactions}</TableCell>
                                  <TableCell>
                                    {formatCurrency(item.amount)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow
                                sx={{ bgcolor: "rgba(245, 0, 87, 0.1)" }}
                              >
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Tổng
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  {revenueData.routes.reduce(
                                    (sum, item) => sum + item.transactions,
                                    0
                                  )}
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  {formatCurrency(revenueData.routes
                                    .reduce(
                                      (sum, item) => sum + item.amount,
                                      0
                                    )
                                  )}
                                </TableCell>
                              </TableRow>
                            </>
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                Không có dữ liệu doanh thu
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </StyledTableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </StyledCard>

      {/* Dialog to view receipt */}
      {selectedPayment && (
        <Dialog
          open={receiptOpen}
          onClose={handleCloseReceipt}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Biên lai thanh toán</DialogTitle>
          <Divider />
          <DialogContent>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                BIÊN LAI THANH TOÁN
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date().toLocaleDateString("vi-VN")}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Mã đặt vé
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPayment.bookingCode}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Tuyến xe
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPayment.routeName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Khách hàng
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPayment.customerName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedPayment.paymentMethod}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Ngày thanh toán
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(selectedPayment.paymentDate)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái
                </Typography>
                <Chip
                  label={selectedPayment.status}
                  size="small"
                  color={getStatusChipColor(selectedPayment.status)}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1">Tổng tiền</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {formatCurrency(selectedPayment.amount).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseReceipt} variant="outlined">
              Đóng
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={() => handleDownloadFilePdf(selectedPayment)}
              disabled={isLoading}
            >
              Tải biên lai
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PaymentManagementDashboard;
