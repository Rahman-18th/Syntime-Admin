export interface CompanyOption {
  id: string;
  name: string;
  address: string | null;
}

export interface DepartmentOption {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
}

export interface OfficeOption {
  id: string;
  companyId: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  allowedRadiusMeters: number;
}

export interface CompanyListResponse {
  success: boolean;
  message: string;
  data: CompanyOption[];
}

export interface DepartmentListResponse {
  success: boolean;
  message: string;
  data: DepartmentOption[];
}

export interface OfficeListResponse {
  success: boolean;
  message: string;
  data: OfficeOption[];
}