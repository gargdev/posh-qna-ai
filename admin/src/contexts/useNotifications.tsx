import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';
import type { NotificationContextType } from './NotificationContext';

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};