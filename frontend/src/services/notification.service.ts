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

  async getExpoPushToken(): Promise<string | null> {
    try {
      console.log('Starting FCM token retrieval...');
      console.log('Device info:', {
        isDevice: Device.isDevice,
        deviceName: Device.deviceName,
        osName: Device.osName,
        osVersion: Device.osVersion,
        platform: Platform.OS
      });

      if (!Device.isDevice) {
        console.error('❌ Not running on physical device');
        Alert.alert('Error', 'Push notifications only work on physical devices');
        return null;
      }

      // Get the native FCM device token instead of Expo push token
      console.log('Getting native device push token (FCM)...');
      const tokenData = await Notifications.getDevicePushTokenAsync();
      
      const token = tokenData.data;
      console.log('✅ FCM Device Token received:', token);
      console.log('Token type:', tokenData.type); // Should be 'fcm' for Android
      
      return token;
    } catch (error) {
      console.error('❌ Error getting FCM token:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = error instanceof Error && 'code' in error ? (error as any).code : undefined;
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      console.error('Error details:', {
        message: errorMessage,
        code: errorCode,
        stack: errorStack,
        fullError: JSON.stringify(error, null, 2)
      });
      
      Alert.alert(
        'Push Token Error', 
        `Failed to get FCM device token.\n\nError: ${errorMessage}\n\nThis is needed for notifications to work.`
      );
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
