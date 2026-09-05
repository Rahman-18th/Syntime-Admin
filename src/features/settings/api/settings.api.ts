import api from "../../../api/axios";

import type {
  ApiResponse,
  SystemSettings,
} from "../types/settings.types";

export async function getSettings() {
  const response =
    await api.get<
      ApiResponse<SystemSettings>
    >("/settings");

  return response.data.data;
}

export async function updateSettings(
  payload: SystemSettings
) {
  const response =
    await api.put<
      ApiResponse<SystemSettings>
    >("/settings", payload);

  return response.data.data;
}