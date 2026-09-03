import api from '../../../api/axios';

import type {
  CreatePayslipPayload,
  PayslipListResponse,
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