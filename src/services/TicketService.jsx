import { fetchWithAuth, handleApiError } from "../utils/fetchUtils";

const TicketService = {
  async getAdminTickets() {
    try {
      return await fetchWithAuth("/admin/ticket");
    } catch (error) {
      throw handleApiError(error);
    }
  },
  async updateStatusTickets(dataReq) {
    try {
      return await fetchWithAuth("/admin/ticket", "PUT", dataReq);
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default TicketService;
