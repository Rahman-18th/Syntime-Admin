export interface NotificationEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string | null;
  email: string;
  position: string | null;
  status: string;
}

export interface AdminNotification {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  type: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  employee: NotificationEmployee;
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: AdminNotification[];
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: AdminNotification;
}

export interface CreateNotificationPayload {
  employeeId: string;
  title: string;
  message: string;
  type?: string;
}