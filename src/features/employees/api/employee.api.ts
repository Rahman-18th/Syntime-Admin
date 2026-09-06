import api from '../../../api/axios';

import type {
  CreateEmployeePayload,
  EmployeeAccountResponse,
  EmployeeAccountStatusResponse,
  EmployeeListResponse,
  EmployeePaginatedResult,
  EmployeeQueryParams,
  EmployeeResponse,
  EmployeeStatus,
  UpdateEmployeePayload,
} from '../types/employee.types';

export async function getEmployeesPaginated(
  params: EmployeeQueryParams,
): Promise<EmployeePaginatedResult> {
  const response =
    await api.get<EmployeeListResponse>(
      '/employees',
      {
        params,
      },
    );

  const data =
    response.data.data;

  const meta =
    response.data.meta;

  if (!meta) {
    return {
      data,
      meta: {
        page: 1,
        limit: data.length,
        total: data.length,
        totalPages:
          data.length > 0
            ? 1
            : 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  return {
    data,
    meta,
  };
}

export async function getEmployees() {
  const response =
    await api.get<EmployeeListResponse>(
      '/employees',
    );

  return response.data.data;
}

export async function createEmployee(
  payload: CreateEmployeePayload,
) {
  const response =
    await api.post<EmployeeResponse>(
      '/employees',
      payload,
    );

  return response.data.data;
}

export async function updateEmployee(
  id: string,
  payload: UpdateEmployeePayload,
) {
  const response =
    await api.put<EmployeeResponse>(
      `/employees/${id}`,
      payload,
    );

  return response.data.data;
}

export async function updateEmployeeStatus(
  id: string,
  status: EmployeeStatus,
) {
  const response =
    await api.patch<EmployeeResponse>(
      `/employees/${id}/status`,
      {
        status,
      },
    );

  return response.data.data;
}

export async function createEmployeeAccount(
  employeeId: string,
) {
  const response =
    await api.post<EmployeeAccountResponse>(
      `/employees/${employeeId}/account`,
    );

  return response.data.data;
}

export async function resetEmployeePassword(
  employeeId: string,
) {
  const response =
    await api.post<EmployeeAccountResponse>(
      `/employees/${employeeId}/account/reset-password`,
    );

  return response.data.data;
}

export async function updateEmployeeAccountStatus(
  employeeId: string,
  isActive: boolean,
) {
  const response =
    await api.patch<EmployeeAccountStatusResponse>(
      `/employees/${employeeId}/account/status`,
      {
        isActive,
      },
    );

  return response.data.data;
}