import apiConfig from "../configs/apiConfig.jsx";
import { fetchWithAuth } from "../utils/fetchUtils.jsx";

const MessageService = {
  // Get all users who have conversations with admin
  async getChatUsers() {
    try {
      const response = await fetchWithAuth('/messages/users', 'GET');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get conversation with specific user
  async getConversation(userId) {
    try {
      const response = await fetchWithAuth(`/messages/conversation/${userId}`, 'GET');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Send message to user
  async sendMessage(userId, content) {
    try {
      const response = await fetchWithAuth('/messages/send', 'POST', {
        recipientId: userId,
        content
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const response = await fetchWithAuth(`/messages/read/${messageId}`, 'PUT');
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export default MessageService; 
