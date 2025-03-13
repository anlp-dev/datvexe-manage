import { fetchWithAuth, handleApiError } from '../utils/fetchUtils.jsx';

class BusOperatorService {
    // Get all buses
    async getAllBuses() {
        try {
            return await fetchWithAuth('/admin/bus', 'GET');
        } catch (error) {
            return handleApiError(error, (message) => {
                console.error('Error fetching buses:', message);
            });
        }
    }

    // Get a single bus by ID
    async getBusById(id) {
        try {
            return await fetchWithAuth(`/admin/bus/${id}`, 'GET');
        } catch (error) {
            return handleApiError(error, (message) => {
                console.error(`Error fetching bus with ID ${id}:`, message);
            });
        }
    }

    // Create a new bus
    async createBus(busData) {
        try {
            return await fetchWithAuth('/admin/bus', 'POST', busData);
        } catch (error) {
            return handleApiError(error, (message) => {
                console.error('Error creating bus:', message);
            });
        }
    }

    // Update an existing bus
    async updateBus(id, busData) {
        try {
            return await fetchWithAuth(`/admin/bus/${id}`, 'PUT', busData);
        } catch (error) {
            return handleApiError(error, (message) => {
                console.error(`Error updating bus with ID ${id}:`, message);
            });
        }
    }

    // Delete a bus
    async deleteBus(id) {
        try {
            return await fetchWithAuth(`/admin/bus/${id}`, 'DELETE');
        } catch (error) {
            return handleApiError(error, (message) => {
                console.error(`Error deleting bus with ID ${id}:`, message);
            });
        }
    }
}

export default new BusOperatorService(); 
