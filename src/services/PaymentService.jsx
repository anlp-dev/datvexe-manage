import { fetchWithAuth, fetchExportFile, handleApiError } from "../utils/fetchUtils";

/**
 * Service for handling payment-related API calls
 */
class PaymentService {
  /**
   * Get all payments
   * @returns {Promise<Array>} - List of payments
   */
  static async getPayments() {
    try {
      const response = await fetchWithAuth('/admin/payment', 'GET');
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get payment statistics
   * @returns {Promise<Object>} - Payment statistics
   */
  static async getPaymentStats() {
    try {
      return await fetchWithAuth('/admin/payment/stats', 'GET');
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async dowloadFilePdf(dataReq){
    try{
      return await fetchExportFile('/admin/payment/download-pdf', 'POST', dataReq);
    }catch(e){
      return handleApiError(e);
    }
  }

  /**
   * Export payment report
   * @param {Object} filters - Filters for the report
   * @returns {Promise<Object>} - Report data or download URL
   */
  static async exportReport(filters = {}) {
    try {
      return await fetchWithAuth('/admin/payment/export', 'POST', filters);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default PaymentService; 
