// API Service - Handles all backend communication

import { API_URL, API_ENDPOINTS } from '../config/constants';
import { ApiResponse, User, NotificationData } from '../types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  // Health check
  async checkHealth(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.HEALTH}`);
      const contentType = response.headers.get('content-type');
      
      if (!contentType?.includes('application/json')) {
        throw new Error('Backend returned non-JSON response (likely offline)');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Register user with push token
  async registerUser(name: string, expoPushToken: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          expoPushToken,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Backend server is offline or unreachable');
      }

      return await response.json();
    } catch (error) {
      console.error('User registration failed:', error);
      throw error;
    }
  }

  // Send notification
  async sendNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<ApiResponse<NotificationData>> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.SEND_NOTIFICATION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title,
          body,
          data,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Backend server is offline or unreachable');
      }

      return await response.json();
    } catch (error) {
      console.error('Send notification failed:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUser(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.GET_USER(userId)}`);

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Backend server is offline or unreachable');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user failed:', error);
      throw error;
    }
  }
}

export default new ApiService();
