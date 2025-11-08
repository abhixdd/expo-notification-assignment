// SendNotificationButton Component

import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import ApiService from '../services/api.service';
import { BackendStatus } from '../types';

interface SendNotificationButtonProps {
  userId: string;
  backendStatus: BackendStatus;
}

export const SendNotificationButton: React.FC<SendNotificationButtonProps> = ({
  userId,
  backendStatus,
}) => {
  const handlePress = async () => {
    if (backendStatus === 'offline') {
      Alert.alert('Error', 'Backend server is offline');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User not registered');
      return;
    }

    try {
      const response = await ApiService.sendNotification(
        userId,
        'Test Notification',
        'Hello! This is a test notification from your Node.js backend!',
        { screen: 'home' }
      );

      if (response.status === 'success') {
        Alert.alert('Success!', 'Test notification sent!\n\nCheck your notification tray.');
      } else {
        Alert.alert('Error', response.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send notification';
      
      // Check if it's a backend connection error
      if (errorMessage.includes('offline') || errorMessage.includes('unreachable')) {
        Alert.alert('Backend Offline', 'Backend server is offline. Please start the server.');
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const isDisabled = !userId || backendStatus === 'offline';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isDisabled ? styles.buttonDisabled : styles.buttonEnabled,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>Send Test Notification</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonEnabled: {
    backgroundColor: '#3B82F6',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
