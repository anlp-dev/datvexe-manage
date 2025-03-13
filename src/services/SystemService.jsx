import { fetchWithAuth, handleApiError } from "../utils/fetchUtils";

const SystemService = {
    async getLogRequest() {
        try {
            return await fetchWithAuth('/system/logRequest/get');
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default SystemService;
