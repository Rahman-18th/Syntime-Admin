export interface AuditActorEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string | null;
}

export interface AuditActor {
  id: string;
  employeeId: string | null;
  email: string;
  isActive: boolean;
  employee: AuditActorEmployee | null;
}

export interface AuditLog {
  id: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  actor: AuditActor | null;
}

export interface AuditPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AuditLogListResponse {
  success: boolean;
  message: string;
  data: AuditLog[];
  meta: AuditPaginationMeta;
}

export interface AuditLogPaginatedResult {
  data: AuditLog[];
  meta: AuditPaginationMeta;
}
