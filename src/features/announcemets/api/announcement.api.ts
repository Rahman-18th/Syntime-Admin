import api from '../../../api/axios';

import type {
  AnnouncementFormPayload,
  AnnouncementListResponse,
  AnnouncementResponse,
} from '../types/announcement.types';

export async function getAnnouncements() {
  const response =
    await api.get<AnnouncementListResponse>(
      '/announcements',
    );

  return response.data.data;
}

export async function createAnnouncement(
  payload: AnnouncementFormPayload,
) {
  const response =
    await api.post<AnnouncementResponse>(
      '/announcements',
      payload,
    );

  return response.data.data;
}

export async function updateAnnouncement(
  id: string,
  payload: AnnouncementFormPayload,
) {
  const response =
    await api.put<AnnouncementResponse>(
      `/announcements/${id}`,
      payload,
    );

  return response.data.data;
}

export async function deleteAnnouncement(
  id: string,
) {
  await api.delete(
    `/announcements/${id}`,
  );
}