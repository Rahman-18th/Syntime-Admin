import api from '../../../api/axios';

import type {
  RequestListResponse,
  RequestPaginatedResult,
  RequestQueryParams,
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

export async function getRequestsPaginated(
  params: RequestQueryParams,
): Promise<RequestPaginatedResult> {
  const response =
    await api.get<RequestListResponse>(
      '/requests',
      {
        params,
      },
    );

  const data = response.data.data;
  const meta = response.data.meta;

  if (meta) {
    return { data, meta };
  }

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
        totalRequests: data.length,
        pending: data.filter((item) => item.status === 'pending').length,
        approved: data.filter((item) => item.status === 'approved').length,
        rejected: data.filter((item) => item.status === 'rejected').length,
      },
    },
  };
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