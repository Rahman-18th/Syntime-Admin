export type AnnouncementPriority =
  | 'normal'
  | 'important'
  | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementFormPayload {
  title: string;
  message: string;
  priority: AnnouncementPriority;
  isPublished: boolean;
}

export interface AnnouncementListResponse {
  success: boolean;
  message: string;
  data: Announcement[];
}

export interface AnnouncementResponse {
  success: boolean;
  message: string;
  data: Announcement;
}