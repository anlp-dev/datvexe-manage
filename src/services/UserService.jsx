import { fetchWithAuth, handleApiError } from "../utils/fetchUtils";

const UserService = {
    async getAllUsers() {
        try {
            return await fetchWithAuth('/admin/users');
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    async createUser(userData) {
        try {
            return await fetchWithAuth('/admin/users', 'POST', userData);
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    async updateUser(userData) {
        try {
            return await fetchWithAuth('/admin/users', 'PUT', userData);
        } catch (error) {
            throw handleApiError(error);
        }
    },
    
    async deleteUser(userId) {
        try {
            return await fetchWithAuth(`/admin/users/${userId}`, 'DELETE');
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async getUserStats() {
        try {
            return await fetchWithAuth('/admin/users/stats');
        } catch (error) {
            throw handleApiError(error);
        }
    }
};

export default UserService; 
