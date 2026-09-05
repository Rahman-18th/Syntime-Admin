import {
  Search,
  Shield,
  UserRoundCog,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import type {
  RbacUser,
  Role,
} from "../types/rbac.types";

interface Props {
  users: RbacUser[];
  roles: Role[];
  isMutating: boolean;

  onAssignRole: (
    userId: string,
    roleId: string
  ) => Promise<void>;

  onRemoveRole: (
    userId: string,
    roleId: string
  ) => Promise<void>;
}

export default function UserRolePanel({
  users,
  roles,
  isMutating,
  onAssignRole,
  onRemoveRole,
}: Props) {
  const [search, setSearch] =
    useState("");

  const adminRole =
    roles.find(
      (role) =>
        role.name === "admin"
    ) ?? null;

  const activeAdminCount =
    useMemo(() => {
      if (!adminRole) {
        return 0;
      }

      return users.filter(
        (user) =>
          user.isActive &&
          user.roles.some(
            (item) =>
              item.roleId ===
              adminRole.id
          )
      ).length;
    }, [
      users,
      adminRole,
    ]);

  const filteredUsers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return users;
      }

      return users.filter(
        (user) => {
          const employeeName =
            user.employee
              ? [
                  user.employee
                    .firstName,
                  user.employee
                    .lastName,
                ]
                  .filter(Boolean)
                  .join(" ")
                  .toLowerCase()
              : "";

          return (
            user.email
              .toLowerCase()
              .includes(query) ||
            employeeName.includes(
              query
            ) ||
            user.employee
              ?.employeeNumber
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [users, search]);

  return (
    <section className="panel-card">
      <div className="panel-heading">
        <div>
          <p className="page-eyebrow">
            Users
          </p>

          <h2>
            User Role Assignment
          </h2>

          <p>
            Assign application roles
            to existing user accounts.
          </p>
        </div>

        <UserRoundCog size={20} />
      </div>

      <div className="employee-search rbac-user-search">
        <Search size={17} />

        <input
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search user, employee, or email..."
        />
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Employee</th>
              <th>Status</th>
              <th>Roles</th>
              <th>Add Role</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(
              (user) => {
                const assignedRoleIds =
                  new Set(
                    user.roles.map(
                      (item) =>
                        item.roleId
                    )
                  );

                const availableRoles =
                  roles.filter(
                    (role) =>
                      !assignedRoleIds.has(
                        role.id
                      )
                  );

                const employeeName =
                  user.employee
                    ? [
                        user
                          .employee
                          .firstName,
                        user
                          .employee
                          .lastName,
                      ]
                        .filter(Boolean)
                        .join(" ")
                    : "System account";

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="employee-copy">
                        <strong>
                          {user.email}
                        </strong>

                        <small>
                          User #{user.id}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div className="employee-copy">
                        <strong>
                          {
                            employeeName
                          }
                        </strong>

                        {user.employee && (
                          <small>
                            {
                              user
                                .employee
                                .employeeNumber
                            }
                          </small>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          user.isActive
                            ? "status-badge active"
                            : "status-badge inactive"
                        }
                      >
                        {user.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="rbac-role-badges">
                        {user.roles.length ===
                        0 ? (
                          <span className="muted-text">
                            No role
                          </span>
                        ) : (
                          user.roles.map(
                            (item) => {
                              const isLastActiveAdmin =
                                user.isActive &&
                                item.role.name ===
                                  "admin" &&
                                activeAdminCount <=
                                  1;

                              return (
                                <span
                                  key={
                                    item.roleId
                                  }
                                  className="rbac-role-badge"
                                >
                                  <Shield
                                    size={
                                      12
                                    }
                                  />

                                  {
                                    item
                                      .role
                                      .name
                                  }

                                  <button
                                    type="button"
                                    title={
                                      isLastActiveAdmin
                                        ? "Cannot remove the admin role from the last active administrator."
                                        : `Remove ${item.role.name}`
                                    }
                                    disabled={
                                      isMutating ||
                                      isLastActiveAdmin
                                    }
                                    onClick={() =>
                                      void onRemoveRole(
                                        user.id,
                                        item.roleId
                                      )
                                    }
                                  >
                                    <X
                                      size={
                                        12
                                      }
                                    />
                                  </button>
                                </span>
                              );
                            }
                          )
                        )}
                      </div>
                    </td>

                    <td>
                      <select
                        className="attendance-filter"
                        disabled={
                          isMutating ||
                          availableRoles.length ===
                            0
                        }
                        value=""
                        onChange={(
                          event
                        ) => {
                          const roleId =
                            event
                              .target
                              .value;

                          if (
                            roleId
                          ) {
                            void onAssignRole(
                              user.id,
                              roleId
                            );
                          }
                        }}
                      >
                        <option value="">
                          {availableRoles.length ===
                          0
                            ? "All assigned"
                            : "Assign role"}
                        </option>

                        {availableRoles.map(
                          (role) => (
                            <option
                              key={
                                role.id
                              }
                              value={
                                role.id
                              }
                            >
                              {
                                role.name
                              }
                            </option>
                          )
                        )}
                      </select>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}