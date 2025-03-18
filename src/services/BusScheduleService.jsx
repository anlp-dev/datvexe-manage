import { fetchWithAuth, handleApiError } from "../utils/fetchUtils";

const BusScheduleService = {
  async getBusScheduleNow() {
    try {
      return await fetchWithAuth("/manage/busSchedule/admin");
    } catch (error) {
      throw handleApiError(error);
    }
  },
  async generateBusSchedule(dataReq){
    try {
      return await fetchWithAuth("/manage/busSchedule/generate", "POST", dataReq);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  async updateBusScheduleStatus(dataReq) {
    try {
      return await fetchWithAuth(`/manage/busSchedule/update`, "POST", dataReq);
    } catch (error) {
      throw handleApiError(error);
    }
  },
  async cancelBusSchedule(id){
    try {
      return await fetchWithAuth(`/manage/busSchedule/${id}`, "DELETE");
    } catch (error) {
      throw handleApiError(error);
    }
  }
  
  
};

export default BusScheduleService;
