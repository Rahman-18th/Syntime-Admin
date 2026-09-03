export type EmployeeStatus =
  | 'active'
  | 'inactive';

export type WorkType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship';

export interface CompanySummary {
  id: string;
  name: string;
  address: string | null;
}

export interface DepartmentSummary {
  id: string;
  name: string;
}

export interface OfficeSummary {
  id: string;
  name: string;
  address: string | null;
}

export interface EmployeeUser {
  id: string;
  employeeId: string | null;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;

  companyId: string;
  departmentId: string;
  officeId: string;

  employeeNumber: string;

  firstName: string;
  lastName: string | null;

  email: string;
  phone: string | null;

  position: string | null;
  workType: WorkType | null;

  joinDate: string | null;

  status: EmployeeStatus;

  createdAt: string;
  updatedAt: string;

  company: CompanySummary;
  department: DepartmentSummary;
  office: OfficeSummary;

  user: EmployeeUser | null;
}

export interface EmployeeListResponse {
  success: boolean;
  message: string;
  data: Employee[];
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export interface CreateEmployeePayload {
  companyId: string;
  departmentId: string;
  officeId: string;

  employeeNumber: string;

  firstName: string;
  lastName?: string;

  email: string;
  phone?: string;

  position?: string;
  workType?: WorkType;

  joinDate?: string;
}

export interface UpdateEmployeePayload {
  departmentId?: string;
  officeId?: string;

  firstName?: string;
  lastName?: string;

  email?: string;
  phone?: string;

  position?: string;
  workType?: WorkType;

  joinDate?: string;
}

export interface EmployeeAccount {
  id: string;
  employeeId: string;
  email: string;
  isActive: boolean;
}

export interface EmployeeAccountResult {
  user: EmployeeAccount;
  temporaryPassword: string;
}

export interface EmployeeAccountResponse {
  success: boolean;
  message: string;
  data: EmployeeAccountResult;
}

export interface EmployeeAccountStatusResponse {
  success: boolean;
  message: string;
  data: EmployeeAccount;
}