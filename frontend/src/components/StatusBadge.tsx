// StatusBadge Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BackendStatus } from '../types';

interface StatusBadgeProps {
  status: BackendStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'online':
        return styles.online;
      case 'offline':
        return styles.offline;
      case 'checking':
        return styles.checking;
    }
  };

  return (
    <View style={[styles.badge, getStyle()]}>
      <Text style={styles.text}>{status.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  online: {
    backgroundColor: '#10b981',
  },
  offline: {
    backgroundColor: '#ef4444',
  },
  checking: {
    backgroundColor: '#f59e0b',
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
});
