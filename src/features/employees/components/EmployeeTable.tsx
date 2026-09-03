import {
  KeyRound,
  Pencil,
  Power,
  PowerOff,
  RefreshCw,
  UserPlus,
} from 'lucide-react';

import type {
  Employee,
} from '../types/employee.types';

interface EmployeeTableProps {
  items: Employee[];

  onEdit: (
    employee: Employee,
  ) => void;

  onToggleStatus: (
    employee: Employee,
  ) => void;

  onCreateAccount: (
    employee: Employee,
  ) => void;

  onResetPassword: (
    employee: Employee,
  ) => void;

  onToggleAccountStatus: (
    employee: Employee,
  ) => void;
}

export default function EmployeeTable({
  items,
  onEdit,
  onToggleStatus,
  onCreateAccount,
  onResetPassword,
  onToggleAccountStatus,
}: EmployeeTableProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          👥
        </div>

        <h3>
          No employees found
        </h3>

        <p>
          Try changing your search
          or add a new employee.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Position</th>
            <th>Employment</th>
            <th>Login Account</th>
            <th className="table-action-column">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const fullName = [
              item.firstName,
              item.lastName,
            ]
              .filter(Boolean)
              .join(' ');

            const employeeActive =
              item.status === 'active';

            const account =
              item.user;

            return (
              <tr key={item.id}>
                <td>
                  <div className="employee-cell">
                    <div className="employee-avatar">
                      {item.firstName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="employee-copy">
                      <strong>
                        {fullName}
                      </strong>

                      <span>
                        {item.employeeNumber}
                      </span>

                      <small>
                        {item.email}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  {item.department?.name ??
                    '-'}
                </td>

                <td>
                  {item.position ?? '-'}
                </td>

                <td>
                  <span
                    className={
                      employeeActive
                        ? 'status-badge status-published'
                        : 'status-badge status-draft'
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  {!account ? (
                    <span className="status-badge account-none">
                      No Account
                    </span>
                  ) : account.isActive ? (
                    <span className="status-badge status-published">
                      Active
                    </span>
                  ) : (
                    <span className="status-badge account-disabled">
                      Disabled
                    </span>
                  )}
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="table-action-button"
                      onClick={() =>
                        onEdit(item)
                      }
                      title="Edit employee"
                    >
                      <Pencil size={16} />
                    </button>

                    {!account ? (
                      <button
                        type="button"
                        className="table-action-button account-create-button"
                        onClick={() =>
                          onCreateAccount(item)
                        }
                        title="Create login account"
                      >
                        <UserPlus size={16} />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="table-action-button"
                          onClick={() =>
                            onResetPassword(
                              item,
                            )
                          }
                          title="Reset password"
                        >
                          <RefreshCw
                            size={16}
                          />
                        </button>

                        <button
                          type="button"
                          className={
                            account.isActive
                              ? 'table-action-button table-delete-button'
                              : 'table-action-button account-create-button'
                          }
                          onClick={() =>
                            onToggleAccountStatus(
                              item,
                            )
                          }
                          title={
                            account.isActive
                              ? 'Disable login'
                              : 'Enable login'
                          }
                        >
                          {account.isActive ? (
                            <KeyRound
                              size={16}
                            />
                          ) : (
                            <Power
                              size={16}
                            />
                          )}
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className={
                        employeeActive
                          ? 'table-action-button table-delete-button'
                          : 'table-action-button'
                      }
                      onClick={() =>
                        onToggleStatus(
                          item,
                        )
                      }
                      title={
                        employeeActive
                          ? 'Deactivate employee'
                          : 'Activate employee'
                      }
                    >
                      {employeeActive ? (
                        <PowerOff
                          size={16}
                        />
                      ) : (
                        <Power
                          size={16}
                        />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}