import api from '../../../api/axios';

import type {
  RequestListResponse,
  RequestResponse,
  ReviewRequestPayload,
} from '../types/request.types';

export async function getRequests() {
  const response =
    await api.get<RequestListResponse>(
      '/requests',
    );

  return response.data.data;
}

export async function reviewRequest(
  id: string,
  payload: ReviewRequestPayload,
) {
  const response =
    await api.patch<RequestResponse>(
      `/requests/${id}/review`,
      payload,
    );

  return response.data.data;
}