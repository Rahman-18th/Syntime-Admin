import api from '../../../api/axios';

import type {
  CreatePayslipPayload,
  PayslipListResponse,
  PayslipPaginatedResult,
  PayslipQueryParams,
  PayslipResponse,
  UpdatePayslipPayload,
} from '../types/payslip.types';

export async function getPayslips() {
  const response =
    await api.get<PayslipListResponse>(
      '/payslips',
    );

  return response.data.data;
}

export async function getPayslipsPaginated(
  params: PayslipQueryParams,
): Promise<PayslipPaginatedResult> {
  const response =
    await api.get<PayslipListResponse>(
      '/payslips',
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
        totalRecords: data.length,
        published: data.filter((item) => item.status === 'published').length,
        draft: data.filter((item) => item.status === 'draft').length,
        totalTakeHomePay: data.reduce(
          (total, item) => total + Number(item.takeHomePay),
          0,
        ),
      },
    },
  };
}

export async function createPayslip(
  payload: CreatePayslipPayload,
) {
  const response =
    await api.post<PayslipResponse>(
      '/payslips',
      payload,
    );

  return response.data.data;
}

export async function updatePayslip(
  id: string,
  payload: UpdatePayslipPayload,
) {
  const response =
    await api.put<PayslipResponse>(
      `/payslips/${id}`,
      payload,
    );

  return response.data.data;
}