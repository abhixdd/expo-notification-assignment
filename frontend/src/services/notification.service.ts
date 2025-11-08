// Notification Service - Handles Expo notifications

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import { NOTIFICATION_CONFIG } from '../config/constants';

class NotificationService {
  // Configure notification handler
  configure() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    console.log('✅ Notification handler configured');
  }

  // Setup Android notification channel
  async setupAndroidChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(NOTIFICATION_CONFIG.CHANNEL_ID, {
        name: NOTIFICATION_CONFIG.CHANNEL_NAME,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: NOTIFICATION_CONFIG.VIBRATION_PATTERN,
        lightColor: NOTIFICATION_CONFIG.LIGHT_COLOR,
      });
    }
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      Alert.alert('Error', 'Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please enable notifications!');
      return false;
    }

    return true;
  }

  // Get Expo push token
  async getExpoPushToken(): Promise<string | null> {
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      if (!projectId) {
        console.warn('Project ID not found in app config');
      }

      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('✅ Expo Push Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      Alert.alert('Error', 'Failed to get push token');
      return null;
    }
  }

  // Add notification received listener
  addNotificationListener(callback: (notification: Notifications.Notification) => void) {
    console.log('Notification listener added');
    return Notifications.addNotificationReceivedListener((notification) => {
      console.log('Raw notification received:', notification);
      callback(notification);
    });
  }

  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    console.log('Notification response listener added');
    return Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
      callback(response);
    });
  }
}

export default new NotificationService();
