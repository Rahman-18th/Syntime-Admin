export type PayslipStatus =
  | 'draft'
  | 'published';

export interface PayslipEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string | null;
  email: string;
  position: string | null;
}

export interface Payslip {
  id: string;

  employeeId: string;

  periodMonth: number;
  periodYear: number;

  basicSalary: string;
  totalIncome: string;
  totalDeduction: string;
  takeHomePay: string;

  status: PayslipStatus;

  createdAt: string;
  updatedAt: string;

  employee: PayslipEmployee;
}

export interface PayslipSummary {
  totalRecords: number;
  published: number;
  draft: number;
  totalTakeHomePay: number;
}

export interface PayslipPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  summary: PayslipSummary;
}

export interface PayslipQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PayslipStatus;
  month?: number;
  year?: number;
}

export interface PayslipPaginatedResult {
  data: Payslip[];
  meta: PayslipPaginationMeta;
}

export interface PayslipListResponse {
  success: boolean;
  message: string;
  data: Payslip[];
  meta?: PayslipPaginationMeta;
}

export interface PayslipResponse {
  success: boolean;
  message: string;
  data: Payslip;
}

export interface CreatePayslipPayload {
  employeeId: string;
  periodMonth: number;
  periodYear: number;
  basicSalary: number;
  totalIncome: number;
  totalDeduction: number;
  status: PayslipStatus;
}

export interface UpdatePayslipPayload {
  basicSalary?: number;
  totalIncome?: number;
  totalDeduction?: number;
  status?: PayslipStatus;
}