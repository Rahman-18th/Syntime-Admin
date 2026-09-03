import api from '../../../api/axios';

import type {
  AttendanceListResponse,
} from '../types/attendance.types';

export async function getAttendances() {
  const response =
    await api.get<AttendanceListResponse>(
      '/attendances',
    );

  return response.data.data;
}