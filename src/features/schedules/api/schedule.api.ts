import api from '../../../api/axios';

import type {
  ScheduleListResponse,
  SchedulePayload,
  ScheduleResponse,
} from '../types/schedule.types';

export async function getSchedules() {
  const response =
    await api.get<ScheduleListResponse>(
      '/schedules',
    );

  return response.data.data;
}

export async function createSchedule(
  payload: SchedulePayload,
) {
  const response =
    await api.post<ScheduleResponse>(
      '/schedules',
      payload,
    );

  return response.data.data;
}

export async function updateSchedule(
  id: string,
  payload: Partial<SchedulePayload>,
) {
  const response =
    await api.put<ScheduleResponse>(
      `/schedules/${id}`,
      payload,
    );

  return response.data.data;
}