import {
  Check,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import type {
  Permission,
  Role,
} from "../types/rbac.types";

interface Props {
  roles: Role[];
  permissions: Permission[];
  selectedRoleId: string;
  isMutating: boolean;

  onSelectRole: (
    roleId: string
  ) => void;

  onTogglePermission: (
    permissionId: string,
    assigned: boolean
  ) => Promise<void>;
}

export default function RolePermissionPanel({
  roles,
  permissions,
  selectedRoleId,
  isMutating,
  onSelectRole,
  onTogglePermission,
}: Props) {
  const selectedRole =
    roles.find(
      (role) =>
        role.id === selectedRoleId
    ) ?? null;

  const assignedPermissionIds =
    new Set(
      selectedRole?.permissions.map(
        (item) =>
          item.permissionId
      ) ?? []
    );

  return (
    <div className="rbac-grid">
      <section className="panel-card">
        <div className="panel-heading">
          <div>
            <p className="page-eyebrow">
              Roles
            </p>

            <h2>
              Access Roles
            </h2>

            <p>
              Select a role to manage
              its permissions.
            </p>
          </div>

          <ShieldCheck size={20} />
        </div>

        <div className="rbac-role-list">
          {roles.map((role) => {
            const active =
              role.id ===
              selectedRoleId;

            return (
              <button
                key={role.id}
                type="button"
                className={
                  active
                    ? "rbac-role-item active"
                    : "rbac-role-item"
                }
                onClick={() =>
                  onSelectRole(
                    role.id
                  )
                }
              >
                <div>
                  <strong>
                    {role.name}
                  </strong>

                  <span>
                    {role.description ??
                      "No description"}
                  </span>
                </div>

                <div className="rbac-role-counts">
                  <small>
                    {
                      role._count
                        .users
                    }{" "}
                    users
                  </small>

                  <small>
                    {
                      role._count
                        .permissions
                    }{" "}
                    permissions
                  </small>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel-card">
        <div className="panel-heading">
          <div>
            <p className="page-eyebrow">
              Permissions
            </p>

            <h2>
              {selectedRole
                ? selectedRole.name
                : "Select role"}
            </h2>

            <p>
              Assign or remove
              permissions from this
              role.
            </p>
          </div>

          <LockKeyhole size={20} />
        </div>

        {!selectedRole ? (
          <div className="empty-state">
            <p>
              Select a role first.
            </p>
          </div>
        ) : (
          <div className="rbac-permission-grid">
            {permissions.map(
              (permission) => {
                const assigned =
                  assignedPermissionIds.has(
                    permission.id
                  );

                return (
                  <button
                    key={
                      permission.id
                    }
                    type="button"
                    className={
                      assigned
                        ? "rbac-permission-item assigned"
                        : "rbac-permission-item"
                    }
                    disabled={
                      isMutating
                    }
                    onClick={() =>
                      void onTogglePermission(
                        permission.id,
                        assigned
                      )
                    }
                  >
                    <div className="rbac-permission-check">
                      {assigned && (
                        <Check
                          size={14}
                        />
                      )}
                    </div>

                    <div>
                      <strong>
                        {
                          permission.name
                        }
                      </strong>

                      <span>
                        {permission.description ??
                          "No description"}
                      </span>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        )}
      </section>
    </div>
  );
}