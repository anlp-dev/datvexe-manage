import { fetchWithAuth, handleApiError } from "../utils/fetchUtils";

const DiscountService = {
  async getAllDiscount() {
    try {
      return await fetchWithAuth('/admin/discount');
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  async createDiscount(dataReq) {
    try {
      return await fetchWithAuth('/admin/discount', 'POST', dataReq);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  async updateDiscount(dataReq) {
    try {
      return await fetchWithAuth('/admin/discount', 'PUT', dataReq);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  
  async deleteDiscount(id) {
    try {
      return await fetchWithAuth(`/admin/discount/${id}`, 'DELETE', null);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default DiscountService;
