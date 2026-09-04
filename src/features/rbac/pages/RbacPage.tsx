import axios from "axios";

import {
  RefreshCw,
  ShieldCheck,
  Users,
  KeyRound,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  assignPermissionToRole,
  assignRoleToUser,
  getPermissions,
  getRbacUsers,
  getRoles,
  removePermissionFromRole,
  removeRoleFromUser,
} from "../api/rbac.api";

import RolePermissionPanel
    from "../components/RolePermissionPanel";

import UserRolePanel
  from "../components/UserRolePanel";

import type {
  Permission,
  RbacUser,
  Role,
} from "../types/rbac.types";

type Tab =
  | "permissions"
  | "users";

export default function RbacPage() {
  const [roles, setRoles] =
    useState<Role[]>([]);

  const [
    permissions,
    setPermissions,
  ] =
    useState<Permission[]>([]);

  const [users, setUsers] =
    useState<RbacUser[]>([]);

  const [
    selectedRoleId,
    setSelectedRoleId,
  ] =
    useState("");

  const [tab, setTab] =
    useState<Tab>(
      "permissions"
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isMutating,
    setIsMutating,
  ] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [
        roleData,
        permissionData,
        userData,
      ] =
        await Promise.all([
          getRoles(),
          getPermissions(),
          getRbacUsers(),
        ]);

      setRoles(roleData);
      setPermissions(
        permissionData
      );
      setUsers(userData);

      setSelectedRoleId(
        (current) =>
          current ||
          roleData[0]?.id ||
          ""
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Failed to load RBAC data."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTogglePermission(
    permissionId: string,
    assigned: boolean
  ) {
    if (!selectedRoleId) {
      return;
    }

    setIsMutating(true);
    setError(null);

    try {
      if (assigned) {
        await removePermissionFromRole(
          selectedRoleId,
          permissionId
        );
      } else {
        await assignPermissionToRole(
          selectedRoleId,
          permissionId
        );
      }

      await reloadRoles();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Failed to update role permission."
        )
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function handleAssignRole(
    userId: string,
    roleId: string
  ) {
    setIsMutating(true);
    setError(null);

    try {
      await assignRoleToUser(
        userId,
        roleId
      );

      await reloadUsers();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Failed to assign role."
        )
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function handleRemoveRole(
    userId: string,
    roleId: string
  ) {
    const user =
      users.find(
        (item) =>
          item.id === userId
      );

    if (
      user &&
      user.roles.length <= 1
    ) {
      const confirmed =
        window.confirm(
          "This is the user's last role. Remove it anyway?"
        );

      if (!confirmed) {
        return;
      }
    }

    setIsMutating(true);
    setError(null);

    try {
      await removeRoleFromUser(
        userId,
        roleId
      );

      await reloadUsers();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Failed to remove role."
        )
      );
    } finally {
      setIsMutating(false);
    }
  }

  async function reloadRoles() {
    const roleData =
      await getRoles();

    setRoles(roleData);
  }

  async function reloadUsers() {
    const userData =
      await getRbacUsers();

    setUsers(userData);
  }

  const totalAssignments =
    useMemo(
      () =>
        roles.reduce(
          (
            total,
            role
          ) =>
            total +
            role._count
              .permissions,
          0
        ),
      [roles]
    );

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Security
          </p>

          <h1>
            Access Control
          </h1>

          <p>
            Manage roles,
            permissions, and user
            access.
          </p>
        </div>

        <button
          type="button"
          className="ghost-button button-with-icon"
          disabled={isLoading}
          onClick={() =>
            void loadData()
          }
        >
          <RefreshCw
            size={15}
            className={
              isLoading
                ? "spin"
                : ""
            }
          />

          Refresh
        </button>
      </section>

      <section className="attendance-stat-grid">
        <RbacStat
          label="Roles"
          value={roles.length}
          icon={
            <ShieldCheck
              size={18}
            />
          }
        />

        <RbacStat
          label="Permissions"
          value={
            permissions.length
          }
          icon={
            <KeyRound
              size={18}
            />
          }
        />

        <RbacStat
          label="Users"
          value={users.length}
          icon={
            <Users size={18} />
          }
        />

        <RbacStat
          label="Assignments"
          value={
            totalAssignments
          }
          icon={
            <ShieldCheck
              size={18}
            />
          }
        />
      </section>

      {error && (
        <div className="error-banner">
          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
          >
            ×
          </button>
        </div>
      )}

      <section className="rbac-tabs">
        <button
          type="button"
          className={
            tab ===
            "permissions"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab(
              "permissions"
            )
          }
        >
          Role Permissions
        </button>

        <button
          type="button"
          className={
            tab === "users"
              ? "active"
              : ""
          }
          onClick={() =>
            setTab("users")
          }
        >
          User Roles
        </button>
      </section>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />

          <p>
            Loading access control...
          </p>
        </div>
      ) : tab ===
        "permissions" ? (
        <RolePermissionPanel
          roles={roles}
          permissions={
            permissions
          }
          selectedRoleId={
            selectedRoleId
          }
          isMutating={
            isMutating
          }
          onSelectRole={
            setSelectedRoleId
          }
          onTogglePermission={
            handleTogglePermission
          }
        />
      ) : (
        <UserRolePanel
          users={users}
          roles={roles}
          isMutating={
            isMutating
          }
          onAssignRole={
            handleAssignRole
          }
          onRemoveRole={
            handleRemoveRole
          }
        />
      )}
    </div>
  );
}

function RbacStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <article className="mini-stat">
      <div>
        <span>{label}</span>

        <strong>
          {value}
        </strong>
      </div>

      <div className="mini-stat-icon">
        {icon}
      </div>
    </article>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    axios.isAxiosError(error)
  ) {
    return (
      error.response?.data
        ?.message ??
      fallback
    );
  }

  return fallback;
}