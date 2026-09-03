import api from '../../../api/axios';

import type {
  AdminDashboardResponse,
} from '../types/dashboard.types';

export async function getAdminDashboard() {
  const response =
    await api.get<AdminDashboardResponse>(
      '/dashboard/admin',
    );

  return response.data.data;
}