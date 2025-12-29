'use client';

import { useState, useCallback } from 'react';
import { Notification, NotificationType } from '../components/Notification';

interface NotificationState {
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = useCallback((
    type: NotificationType,
    message: string,
    title?: string,
    duration?: number
  ) => {
    setNotification({ type, message, title, duration });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const NotificationComponent = notification ? (
    <Notification
      type={notification.type}
      message={notification.message}
      title={notification.title}
      onClose={hideNotification}
      duration={notification.duration}
    />
  ) : null;

  return {
    showNotification,
    hideNotification,
    NotificationComponent,
  };
}

