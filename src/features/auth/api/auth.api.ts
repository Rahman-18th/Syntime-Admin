import api from '../../../api/axios';
import type {
  LoginRequest,
  LoginResponse,
} from '../types/auth.types';

export async function loginAdmin(
  payload: LoginRequest,
) {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    payload,
  );

  return response.data;
}