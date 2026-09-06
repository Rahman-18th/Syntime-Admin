import api from '../../../api/axios';

import type {
  AuditLogListResponse,
  AuditLogPaginatedResult,
  AuditLogQueryParams,
} from '../types/audit-log.types';

export async function getAuditLogs(
  params: AuditLogQueryParams,
): Promise<AuditLogPaginatedResult> {
  const response =
    await api.get<AuditLogListResponse>(
      '/audit-logs',
      {
        params,
      },
    );

  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}
