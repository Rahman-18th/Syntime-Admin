export interface Company {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;

  company?: {
    id: string;
    name: string;
  };
}

export interface Office {
  id: string;
  companyId: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  allowedRadiusMeters: number;
  createdAt: string;
  updatedAt: string;

  company?: {
    id: string;
    name: string;
  };
}

export interface CompanyListResponse {
  success: boolean;
  message: string;
  data: Company[];
}

export interface DepartmentListResponse {
  success: boolean;
  message: string;
  data: Department[];
}

export interface OfficeListResponse {
  success: boolean;
  message: string;
  data: Office[];
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}

export interface DepartmentResponse {
  success: boolean;
  message: string;
  data: Department;
}

export interface OfficeResponse {
  success: boolean;
  message: string;
  data: Office;
}

export interface CompanyPayload {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface DepartmentPayload {
  companyId: string;
  name: string;
  description?: string;
}

export interface OfficePayload {
  companyId: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  allowedRadiusMeters?: number;
}