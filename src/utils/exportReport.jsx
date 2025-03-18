import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatCurrency, formatDate } from "./format";

/**
 * Xuất dữ liệu thành file Excel với nhiều sheet
 * @param {Object} data - Dữ liệu để xuất ra Excel
 * @param {Object} data.summary - Dữ liệu tổng quan (totalRevenue, totalTransactions, etc.)
 * @param {Array} data.dailyRevenue - Dữ liệu doanh thu theo ngày
 * @param {Array} data.routeRevenue - Dữ liệu doanh thu theo tuyến
 * @param {Array} data.transactions - Dữ liệu chi tiết giao dịch
 */
const exportToExcel = (data) => {
  try {
    // Tạo dữ liệu cho sheet tổng quan
    const summaryData = [{
      "Chỉ số": "Tổng doanh thu",
      "Giá trị": formatCurrency(data.summary.totalRevenue)
    }, {
      "Chỉ số": "Tổng giao dịch",
      "Giá trị": data.summary.totalTransactions
    }, {
      "Chỉ số": "Giao dịch thành công",
      "Giá trị": data.summary.successfulPayments
    }, {
      "Chỉ số": "Giao dịch đang chờ",
      "Giá trị": data.summary.pendingPayments
    }, {
      "Chỉ số": "Giao dịch lỗi",
      "Giá trị": data.summary.errorPayments
    }];

    // Tạo dữ liệu cho sheet doanh thu theo ngày
    const dailyRevenueData = data.dailyRevenue.map(day => ({
      "Ngày": day.date,
      "Số giao dịch": day.transactions,
      "Doanh thu": formatCurrency(day.amount)
    }));

    // Tạo dữ liệu cho sheet doanh thu theo tuyến
    const routeRevenueData = data.routeRevenue.map(route => ({
      "Tuyến xe": route.name,
      "Số giao dịch": route.transactions,
      "Doanh thu": formatCurrency(route.amount)
    }));

    // Tạo dữ liệu cho sheet chi tiết giao dịch
    const transactionData = data.transactions.map(payment => ({
      "Mã đặt vé": payment.bookingCode,
      "Khách hàng": payment.customerName,
      "Tuyến xe": payment.routeName,
      "Số tiền": formatCurrency(payment.amount),
      "Phương thức": payment.paymentMethod,
      "Ngày thanh toán": formatDate(payment.paymentDate),
      "Trạng thái": payment.status
    }));

    // Tạo workbook với nhiều sheet
    const workbook = XLSX.utils.book_new();
    
    // Thêm các sheet vào workbook
    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWS, "Tổng quan");
    
    const dailyWS = XLSX.utils.json_to_sheet(dailyRevenueData);
    XLSX.utils.book_append_sheet(workbook, dailyWS, "Doanh thu theo ngày");
    
    const routeWS = XLSX.utils.json_to_sheet(routeRevenueData);
    XLSX.utils.book_append_sheet(workbook, routeWS, "Doanh thu theo tuyến");
    
    const transactionWS = XLSX.utils.json_to_sheet(transactionData);
    XLSX.utils.book_append_sheet(workbook, transactionWS, "Chi tiết giao dịch");

    // Xuất file Excel
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(excelBlob, `bao_cao_doanh_thu_${new Date().toLocaleDateString("vi-VN").replace(/\//g, "-")}.xlsx`);

    return true;
  } catch (error) {
    console.error("Export Excel error:", error);
    throw error;
  }
};

export default exportToExcel;
