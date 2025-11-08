// WarningCard Component

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WarningCardProps {
  onRetry: () => void;
}

export const WarningCard: React.FC<WarningCardProps> = ({ onRetry }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>
        ⚠️ Backend offline. Start your Node.js server first.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onRetry}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>🔄 Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  message: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
