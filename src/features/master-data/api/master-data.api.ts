import api from '../../../api/axios';

import type {
  CompanyListResponse,
  CompanyPayload,
  CompanyResponse,
  DepartmentListResponse,
  DepartmentPayload,
  DepartmentResponse,
  OfficeListResponse,
  OfficePayload,
  OfficeResponse,
  ShiftListResponse,
  ShiftPayload,
  ShiftResponse,
} from '../types/master-data.types';

export async function getCompanies() {
  const response =
    await api.get<CompanyListResponse>(
      '/companies',
    );

  return response.data.data;
}

export async function createCompany(
  payload: CompanyPayload,
) {
  const response =
    await api.post<CompanyResponse>(
      '/companies',
      payload,
    );

  return response.data.data;
}

export async function updateCompany(
  id: string,
  payload: CompanyPayload,
) {
  const response =
    await api.put<CompanyResponse>(
      `/companies/${id}`,
      payload,
    );

  return response.data.data;
}

export async function getDepartments(
  companyId?: string,
) {
  const response =
    await api.get<DepartmentListResponse>(
      '/departments',
      {
        params: {
          ...(companyId && {
            companyId,
          }),
        },
      },
    );

  return response.data.data;
}

export async function createDepartment(
  payload: DepartmentPayload,
) {
  const response =
    await api.post<DepartmentResponse>(
      '/departments',
      payload,
    );

  return response.data.data;
}

export async function updateDepartment(
  id: string,
  payload: DepartmentPayload,
) {
  const response =
    await api.put<DepartmentResponse>(
      `/departments/${id}`,
      payload,
    );

  return response.data.data;
}

export async function getOffices(
  companyId?: string,
) {
  const response =
    await api.get<OfficeListResponse>(
      '/offices',
      {
        params: {
          ...(companyId && {
            companyId,
          }),
        },
      },
    );

  return response.data.data;
}

export async function createOffice(
  payload: OfficePayload,
) {
  const response =
    await api.post<OfficeResponse>(
      '/offices',
      payload,
    );

  return response.data.data;
}

export async function updateOffice(
  id: string,
  payload: OfficePayload,
) {
  const response =
    await api.put<OfficeResponse>(
      `/offices/${id}`,
      payload,
    );

  return response.data.data;
}

export async function getShifts() {
  const response =
    await api.get<ShiftListResponse>(
      '/shifts',
    );

  return response.data.data;
}

export async function createShift(
  payload: ShiftPayload,
) {
  const response =
    await api.post<ShiftResponse>(
      '/shifts',
      payload,
    );

  return response.data.data;
}

export async function updateShift(
  id: string,
  payload: ShiftPayload,
) {
  const response =
    await api.put<ShiftResponse>(
      `/shifts/${id}`,
      payload,
    );

  return response.data.data;
}