// Application Constants

export const API_URL = 'http://localhost:3000' ;
export const APP_NAME = 'Expo Notifications';
export const ENV = 'development';

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  CHANNEL_ID: 'default',
  CHANNEL_NAME: 'Default Notifications',
  SOUND: 'default',
  VIBRATION_PATTERN: [0, 250, 250, 250],
  LIGHT_COLOR: '#FF231F7C',
};

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/',
  REGISTER: '/api/users/register',
  SEND_NOTIFICATION: '/api/notifications/send',
  GET_USER: (userId: string) => `/api/users/${userId}`,
  GET_USERS: '/api/users',
};
