import apiConfig from "../configs/apiConfig.jsx";
import { jwtDecode } from "jwt-decode";

/**
 * Utility function for making authenticated API requests
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} body - Request body (for POST, PUT requests)
 * @param {boolean} includeUserId - Whether to include userId from token in the endpoint (for DELETE requests)
 * @param {Object} customHeaders - Additional headers to include
 * @returns {Promise<any>} - Response data
 */
export const fetchWithAuth = async (
  endpoint,
  method = "GET",
  body = null,
  includeUserId = false,
  customHeaders = {}
) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    // Check if token exists
    if (!token) {
      throw new Error("Đã hết hạn đăng nhập !!!");
    }
    
    // Prepare URL - include userId if needed
    let url = `${apiConfig.baseUrl}${endpoint}`;
    
    if (includeUserId) {
      const decode = jwtDecode(token);
      url = `${apiConfig.baseUrl}${endpoint}${endpoint.endsWith('/') ? '' : '/'}${decode.userId}`;
    }
    
    // Prepare request options
    const options = {
      method,
      headers: {
        ...apiConfig.getAuthHeaders(token),
        ...customHeaders
      }
    };
    
    // Add body if provided
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    // Make the request
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Handle error responses
    if (!response.ok) {
      throw new Error(data.message || "Có lỗi xảy ra");
    }
    
    return data;
  } catch (error) {
    if(error.message === "jwt expired"){
      window.location.href = "/403";
    }
    throw error;
  }
};

/**
 * Utility function for handling API errors consistently
 * @param {Error} error - The error object
 * @param {Function} callback - Optional callback for custom error handling
 * @returns {Object} - Error object with message
 */
export const handleApiError = (error, callback = null) => {
  const errorMessage = error.message || "Có lỗi xảy ra khi kết nối đến máy chủ";
  
  // Call custom error handler if provided
  if (callback && typeof callback === 'function') {
    callback(errorMessage);
  }
  
  return { error: true, message: errorMessage };
}; 
