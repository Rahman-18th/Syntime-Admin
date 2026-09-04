export interface Permission {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;

  _count?: {
    roles: number;
  };
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  permission: Permission;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;

  permissions: RolePermission[];

  _count: {
    users: number;
    permissions: number;
  };
}

export interface RbacEmployee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string | null;
  position: string | null;
  status: string;
}

export interface UserRoleItem {
  userId: string;
  roleId: string;

  role: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
  };
}

export interface RbacUser {
  id: string;
  employeeId: string | null;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;

  employee: RbacEmployee | null;

  roles: UserRoleItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}