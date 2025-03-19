import { fetchWithAuth, handleApiError } from "../utils/fetchUtils";

const ReportService = {
    async getReport() {
        try {
            return await fetchWithAuth('/admin/reports');
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default ReportService; 
