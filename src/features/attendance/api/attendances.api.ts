import api from '../../../api/axios';

import type {
  AttendanceListResponse,
  AttendancePaginatedResult,
  AttendanceQueryParams,
} from '../types/attendance.types';

export async function getAttendances() {
  const response =
    await api.get<AttendanceListResponse>(
      '/attendances',
    );

  return response.data.data;
}

export async function getAttendancesPaginated(
  params: AttendanceQueryParams,
): Promise<AttendancePaginatedResult> {
  const response =
    await api.get<AttendanceListResponse>(
      '/attendances',
      {
        params,
      },
    );

  const data = response.data.data;
  const meta = response.data.meta;

  if (!meta) {
    return {
      data,
      meta: {
        page: 1,
        limit: data.length,
        total: data.length,
        totalPages: data.length > 0 ? 1 : 0,
        hasNextPage: false,
        hasPreviousPage: false,
        summary: {
          totalRecords: data.length,
          present: data.filter(
            (item) => item.status === 'present',
          ).length,
          late: data.filter(
            (item) => item.status === 'late',
          ).length,
          incomplete: data.filter(
            (item) => item.checkOutAt == null,
          ).length,
        },
      },
    };
  }

  return {
    data,
    meta,
  };
}