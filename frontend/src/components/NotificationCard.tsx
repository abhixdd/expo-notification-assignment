// NotificationCard Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';

interface NotificationCardProps {
  notification: Notifications.Notification;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Latest Notification</Text>
      <View style={styles.content}>
        <Text style={styles.notificationTitle}>
          {notification.request.content.title}
        </Text>
        <Text style={styles.notificationBody}>
          {notification.request.content.body}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(notification.date).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  content: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  notificationBody: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
