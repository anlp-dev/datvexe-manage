import { fetchWithAuth, handleApiError } from "../utils/fetchUtils";

const TicketService = {
  async getAdminTickets() {
    try {
      return await fetchWithAuth("/admin/ticket");
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default TicketService;
