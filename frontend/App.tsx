// Expo Push Notification System

import React from 'react';
import { Text, View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import './global.css';

// Hooks
import { useNotifications } from './src/hooks/useNotifications';
import { useBackendStatus } from './src/hooks/useBackendStatus';

import {
  StatusCard,
  NotificationCard,
  SendNotificationButton,
  WarningCard,
  UsernameModal,
} from './src/components';

import { APP_NAME } from './src/config/constants';

export default function App() {
  const {
    expoPushToken,
    userId,
    userName,
    notification,
    isLoading,
    showUsernameModal,
    handleUsernameSubmit,
  } = useNotifications();
  const { backendStatus, checkStatus } = useBackendStatus();

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Initializing...</Text>
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <StatusBar style="light" />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{APP_NAME}</Text>
            <Text style={styles.subtitle}>Push Notification System</Text>
          </View>

          {/* Status Card */}
          <StatusCard
            backendStatus={backendStatus}
            userName={userName}
          />

          {/* Send Button */}
          <SendNotificationButton
            userId={userId}
            backendStatus={backendStatus}
          />

          {/* Backend Offline Warning */}
          {backendStatus === 'offline' && <WarningCard onRetry={checkStatus} />}

          {/* Latest Notification */}
          {notification && <NotificationCard notification={notification} />}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Expo SDK {Constants.expoConfig?.sdkVersion || 'N/A'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Username Modal */}
      <UsernameModal
        visible={showUsernameModal}
        onConfirm={handleUsernameSubmit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
