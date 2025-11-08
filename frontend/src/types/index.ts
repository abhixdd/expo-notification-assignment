// Type Definitions

export interface User {
  userId: string;
  name: string;
  expoPushToken: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  sentAt?: string;
}

export type BackendStatus = 'checking' | 'online' | 'offline';
