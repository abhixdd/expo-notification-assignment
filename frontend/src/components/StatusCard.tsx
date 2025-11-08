// StatusCard Component

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBadge } from './StatusBadge';
import { BackendStatus } from '../types';

interface StatusCardProps {
  backendStatus: BackendStatus;
  userName: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  backendStatus,
  userName,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Status</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Backend:</Text>
        <StatusBadge status={backendStatus} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>User:</Text>
        <Text style={styles.value}>{userName || 'Anonymous'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  value: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
