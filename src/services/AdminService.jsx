import { fetchWithAuth, handleApiError } from "../utils/fetchUtils";

const AdminService = {
    async getRole() {
        try {
            return await fetchWithAuth('/admin/role');
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    async createRole(dataReq) {
        try {
            return await fetchWithAuth('/admin/role', 'POST', dataReq);
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    async getPermission() {
        try {
            return await fetchWithAuth('/admin/permission');
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    async createPermission(dataReq) {
        try {
            return await fetchWithAuth('/admin/permission', 'POST', dataReq);
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    async getRolePermission() {
        try {
            return await fetchWithAuth('/admin/rolePermission');
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    async updateRolePermission(dataReq) {
        try {
            return await fetchWithAuth('/admin/rolePermission', 'PUT', dataReq);
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default AdminService;
