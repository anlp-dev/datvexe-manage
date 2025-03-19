import * as XLSX from 'xlsx';
import { formatCurrency } from '../utils/format';

class ExportService {
    static createStyles() {
        return {
            header: {
                font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "4F81BD" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            },
            subHeader: {
                font: { bold: true, sz: 12 },
                fill: { fgColor: { rgb: "DCE6F1" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            },
            cell: {
                font: { sz: 11 },
                alignment: { vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            },
            cellNumber: {
                font: { sz: 11 },
                alignment: { horizontal: "right", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            },
            total: {
                font: { bold: true, sz: 11 },
                fill: { fgColor: { rgb: "F2F2F2" } },
                alignment: { horizontal: "right", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "double", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            }
        };
    }

    static applyStyles(ws, styles, range, style) {
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cell]) ws[cell] = { v: '', t: 's' };
                ws[cell].s = style;
            }
        }
    }

    static exportToExcel(data) {
        const { revenueReport, percentCancelReport } = data;
        const styles = this.createStyles();
        const wb = XLSX.utils.book_new();

        // Revenue Worksheet
        const revenueData = [
            ['BÁO CÁO DOANH THU VÀ THỐNG KÊ'],
            ['Thời gian xuất báo cáo:', new Date().toLocaleString('vi-VN')],
            [],
            ['TỔNG QUAN DOANH THU'],
            ['Chỉ tiêu', 'Giá trị'],
            ['Tổng doanh thu', formatCurrency(revenueReport.totalRevenue)],
            ['Tổng số vé đã bán', revenueReport.totalTicket],
            ['Trung bình doanh thu/vé', formatCurrency(revenueReport.totalRevenue / revenueReport.totalTicket)],
            [],
            ['CHI TIẾT DOANH THU THEO THÁNG'],
            ['Tháng', 'Số lượng đặt vé', 'Doanh thu', 'Tỷ lệ']
        ];

        // Add revenue details
        let totalRevenue = 0;
        revenueReport.detail.forEach(item => {
            totalRevenue += item.totalRevenue;
            revenueData.push([
                `Tháng ${item.month}`,
                item.totalTicket,
                formatCurrency(item.totalRevenue),
                `${((item.totalRevenue / revenueReport.totalRevenue) * 100).toFixed(1)}%`
            ]);
        });

        // Add total row
        revenueData.push([
            'Tổng cộng',
            revenueReport.totalTicket,
            formatCurrency(totalRevenue),
            '100%'
        ]);

        const wsRevenue = XLSX.utils.aoa_to_sheet(revenueData);

        // Cancellation Worksheet
        const cancelData = [
            ['BÁO CÁO CHI TIẾT HỦY CHUYẾN'],
            ['Thời gian xuất báo cáo:', new Date().toLocaleString('vi-VN')],
            [],
            ['THỐNG KÊ HỦY CHUYẾN THEO TUYẾN'],
            ['Tuyến đường', 'Tổng chuyến', 'Số lần hủy', 'Tỷ lệ hủy', 'Doanh thu mất', 'Lý do hủy chính']
        ];

        // Add cancellation details
        let totalCancellations = 0;
        let totalLostRevenue = 0;

        percentCancelReport.forEach(item => {
            totalCancellations += item.huyChuyen;
            totalLostRevenue += item.doanhThuMat;
            cancelData.push([
                item.route,
                item.tongChuyen,
                item.huyChuyen,
                `${item.tiLeHuy}%`,
                formatCurrency(item.doanhThuMat),
                item.lyDoHuy.join(', ')
            ]);
        });

        // Add total row
        cancelData.push([
            'Tổng cộng',
            percentCancelReport.reduce((sum, item) => sum + item.tongChuyen, 0),
            totalCancellations,
            `${((totalCancellations / percentCancelReport.reduce((sum, item) => sum + item.tongChuyen, 0)) * 100).toFixed(1)}%`,
            formatCurrency(totalLostRevenue),
            ''
        ]);

        const wsCancel = XLSX.utils.aoa_to_sheet(cancelData);

        // Apply styles
        // Revenue worksheet styles
        this.applyStyles(wsRevenue, styles, { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, styles.header);
        this.applyStyles(wsRevenue, styles, { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }, styles.subHeader);
        this.applyStyles(wsRevenue, styles, { s: { r: 10, c: 0 }, e: { r: 10, c: 3 } }, styles.subHeader);

        // Cancellation worksheet styles
        this.applyStyles(wsCancel, styles, { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, styles.header);
        this.applyStyles(wsCancel, styles, { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } }, styles.subHeader);

        // Set column widths
        const revenueColWidths = [
            { wch: 25 }, // A
            { wch: 15 }, // B
            { wch: 20 }, // C
            { wch: 15 }, // D
        ];

        const cancelColWidths = [
            { wch: 30 }, // A
            { wch: 15 }, // B
            { wch: 15 }, // C
            { wch: 15 }, // D
            { wch: 20 }, // E
            { wch: 50 }, // F
        ];

        wsRevenue['!cols'] = revenueColWidths;
        wsCancel['!cols'] = cancelColWidths;

        // Add worksheets to workbook
        XLSX.utils.book_append_sheet(wb, wsRevenue, "Doanh Thu");
        XLSX.utils.book_append_sheet(wb, wsCancel, "Hủy Chuyến");

        // Save file
        const currentDate = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
        XLSX.writeFile(wb, `Bao_Cao_Thong_Ke_${currentDate}.xlsx`);
    }
}

export default ExportService; 
