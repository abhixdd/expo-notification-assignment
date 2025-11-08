// Custom Hook - useNotifications

import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import NotificationService from '../services/notification.service';
import ApiService from '../services/api.service';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    initializeNotifications();

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);


  // Initialize notifications and check for cached user
  const initializeNotifications = async () => {
    NotificationService.configure();
    await NotificationService.setupAndroidChannel();

    const savedUserId = await AsyncStorage.getItem('userId');
    const savedUserName = await AsyncStorage.getItem('userName');

    if (savedUserId && savedUserName) {
      try {
        const response = await ApiService.getUser(savedUserId);
        if (response.status === 'success' && response.data) {
          setUserId(savedUserId);
          setUserName(savedUserName);
          
          notificationListener.current = NotificationService.addNotificationListener((notification) => {
            console.log('Notification received:', notification);
            setNotification(notification);
          });

          responseListener.current = NotificationService.addNotificationResponseListener((response) => {
            console.log('Notification tapped:', response);
          });

          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log('User not found in backend, will re-register');
      }
    }

    // User doesn't exist or not found in backend, show username modal
    setShowUsernameModal(true);
    setIsLoading(false);
  };

  const handleUsernameSubmit = async (username: string) => {
    try {
      setShowUsernameModal(false);
      setIsLoading(true);

      // Trim and validate username
      const trimmedUsername = username.trim();
      if (!trimmedUsername || trimmedUsername.length === 0) {
        Alert.alert('Invalid Input', 'Please enter a valid username');
        setShowUsernameModal(true);
        setIsLoading(false);
        return;
      }

      NotificationService.configure();


      await NotificationService.setupAndroidChannel();

      const hasPermission = await NotificationService.requestPermissions();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Notification permissions are required');
        setShowUsernameModal(true);
        setIsLoading(false);
        return;
      }

      // Get push token
      const token = await NotificationService.getExpoPushToken();
      if (!token) {
        Alert.alert('Error', 'Failed to get push token');
        setShowUsernameModal(true);
        setIsLoading(false);
        return;
      }

      setExpoPushToken(token);

      // Register user in backend DB
      const registerResponse = await registerUser(trimmedUsername, token);
      if (!registerResponse) {
        setShowUsernameModal(true);
        setIsLoading(false);
        return;
      }

      // Setup listeners
      notificationListener.current = NotificationService.addNotificationListener((notification) => {
        console.log('Notification received:', notification);
        setNotification(notification);
      });

      responseListener.current = NotificationService.addNotificationResponseListener((response) => {
        console.log('Notification tapped:', response);
      });

      setUserName(trimmedUsername);
      await AsyncStorage.setItem('userName', trimmedUsername);

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing notifications:', error);
      Alert.alert('Error', 'Failed to initialize notifications');
      setShowUsernameModal(true);
      setIsLoading(false);
    }
  };

  const registerUser = async (username: string, token: string): Promise<boolean> => {
    try {
      const response = await ApiService.registerUser(username, token);

      if (response.status === 'success' && response.data) {
        setUserId(response.data.userId);
        await AsyncStorage.setItem('userId', response.data.userId);
        console.log('User registered:', response.data.userId);
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error registering user:', error);
      
      // Check if it's a backend offline error
      if (errorMessage.includes('offline') || errorMessage.includes('unreachable')) {
        Alert.alert('Backend Offline', 'Backend server is offline. Please start the server and try again.');
      }
      
      return false;
    }
  };

  return {
    expoPushToken,
    userId,
    userName,
    notification,
    isLoading,
    showUsernameModal,
    handleUsernameSubmit,
  };
};
