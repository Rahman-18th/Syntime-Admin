export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  employeeId: string | null;
  email: string;
  roles: string[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: LoginUser;
  };
}