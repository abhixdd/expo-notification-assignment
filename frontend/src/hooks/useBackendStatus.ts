// Custom Hook - useBackendStatus

import { useState, useEffect } from 'react';
import ApiService from '../services/api.service';
import { BackendStatus } from '../types';

export const useBackendStatus = () => {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setBackendStatus('checking');
    try {
      const response = await ApiService.checkHealth();
      setBackendStatus(response.status === 'success' ? 'online' : 'offline');
    } catch (error) {
      setBackendStatus('offline');
      console.log('⚠️ Backend is offline');
    }
  };

  return {
    backendStatus,
    checkStatus,
  };
};
