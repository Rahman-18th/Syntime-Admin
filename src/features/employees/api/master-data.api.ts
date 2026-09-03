import api from '../../../api/axios';

import type {
  CompanyListResponse,
  DepartmentListResponse,
  OfficeListResponse,
} from '../types/master-data.types';

export async function getCompanies() {
  const response =
    await api.get<CompanyListResponse>(
      '/companies',
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