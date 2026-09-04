import api from "../../../api/axios";

import type {
  ApiResponse,
  Permission,
  RbacUser,
  Role,
} from "../types/rbac.types";

export async function getRoles() {
  const response =
    await api.get<ApiResponse<Role[]>>(
      "/rbac/roles"
    );

  return response.data.data;
}

export async function getPermissions() {
  const response =
    await api.get<
      ApiResponse<Permission[]>
    >("/rbac/permissions");

  return response.data.data;
}

export async function getRbacUsers() {
  const response =
    await api.get<
      ApiResponse<RbacUser[]>
    >("/rbac/users");

  return response.data.data;
}

export async function assignPermissionToRole(
  roleId: string,
  permissionId: string
) {
  const response =
    await api.post(
      `/rbac/roles/${roleId}/permissions/${permissionId}`
    );

  return response.data;
}

export async function removePermissionFromRole(
  roleId: string,
  permissionId: string
) {
  const response =
    await api.delete(
      `/rbac/roles/${roleId}/permissions/${permissionId}`
    );

  return response.data;
}

export async function assignRoleToUser(
  userId: string,
  roleId: string
) {
  const response =
    await api.post(
      `/rbac/users/${userId}/roles/${roleId}`
    );

  return response.data;
}

export async function removeRoleFromUser(
  userId: string,
  roleId: string
) {
  const response =
    await api.delete(
      `/rbac/users/${userId}/roles/${roleId}`
    );

  return response.data;
}