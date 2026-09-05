export interface SystemSettings {
  timezone: string;
  default_company_id: string;
  default_office_id: string;
  default_attendance_radius: string;
  system_name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}