import api from '../../../api/axios';

import type {
  CreateNotificationPayload,
  NotificationListResponse,
  NotificationResponse,
} from '../types/notification.types';

export async function getNotifications() {
  const response =
    await api.get<NotificationListResponse>(
      '/notifications',
    );

  return response.data.data;
}

export async function createNotification(
  payload: CreateNotificationPayload,
) {
  const response =
    await api.post<NotificationResponse>(
      '/notifications',
      payload,
    );

  return response.data.data;
}