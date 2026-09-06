import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  Plus,
  RefreshCw,
  Search,
  UserRound,
} from 'lucide-react';

import {
  createEmployee,
  createEmployeeAccount,
  getEmployeesPaginated,
  resetEmployeePassword,
  updateEmployee,
  updateEmployeeAccountStatus,
  updateEmployeeStatus,
} from '../api/employee.api';

import EmployeeFormModal
  from '../components/EmployeeFormModal';

import EmployeeTable
  from '../components/EmployeeTable';

import AccountCredentialModal
  from '../components/AccountCredentialModal';

import type {
  CreateEmployeePayload,
  Employee,
  EmployeePaginationMeta,
  EmployeeStatus,
  UpdateEmployeePayload,
} from '../types/employee.types';

import {
  getDepartments,
} from '../../master-data/api/master-data.api';

import type {
  Department,
} from '../../master-data/types/master-data.types';

import {
  useToast,
} from '../../../components/toast/useToast';

import {
  useConfirm,
} from '../../../components/confirm/useConfirm';

export default function EmployeePage() {
  const { showToast } =
    useToast();

  const { confirm } =
    useConfirm();

  const [items, setItems] =
    useState<Employee[]>([]);

  const [search, setSearch] =
    useState('');

  const [appliedSearch, setAppliedSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [statusFilter, setStatusFilter] =
    useState<'all' | EmployeeStatus>('all');

  const [departmentFilter, setDepartmentFilter] =
    useState('all');

  const [pagination, setPagination] =
    useState<EmployeePaginationMeta>({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] =
    useState<Employee | null>(
      null,
    );

  const [
  credentialResult,
  setCredentialResult,
] = useState<{
  email: string;
  temporaryPassword: string;
  title: string;
} | null>(null);

  const loadEmployees =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result =
          await getEmployeesPaginated({
            page,
            limit,
            ...(appliedSearch && {
              search: appliedSearch,
            }),
            ...(statusFilter !== 'all' && {
              status: statusFilter,
            }),
            ...(departmentFilter !== 'all' && {
              departmentId: departmentFilter,
            }),
          });

        setItems(result.data);
        setPagination(result.meta);
      } catch (error) {
        setError(
          getErrorMessage(
            error,
            'Failed to load employees.',
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      page,
      limit,
      appliedSearch,
      statusFilter,
      departmentFilter,
    ]);

  const loadDepartments =
    useCallback(async () => {
      try {
        const data =
          await getDepartments();

        setDepartments(data);
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Department load failed',
          message: getErrorMessage(
            error,
            'Failed to load departments.',
          ),
        });
      }
    }, [showToast]);

  useEffect(() => {
  const timeoutId =
    window.setTimeout(() => {
      void loadDepartments();
    }, 0);

  return () =>
    window.clearTimeout(
      timeoutId,
    );
}, [loadDepartments]);

useEffect(() => {
  const timeoutId =
    window.setTimeout(() => {
      void loadEmployees();
    }, 0);

  return () =>
    window.clearTimeout(
      timeoutId,
    );
}, [loadEmployees]);

  function handleSearchSubmit() {
    const nextSearch =
      search.trim();

    setAppliedSearch(nextSearch);

    if (page !== 1) {
      setPage(1);
    }
  }

  function openCreateModal() {
    setSelectedEmployee(null);
    setModalOpen(true);
  }

  function openEditModal(
    employee: Employee,
  ) {
    setSelectedEmployee(employee);
    setModalOpen(true);
  }

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setModalOpen(false);
    setSelectedEmployee(null);
  }

  async function handleSubmit(
    payload:
      | CreateEmployeePayload
      | UpdateEmployeePayload,
  ) {
    setIsSubmitting(true);

    try {
      const isEditing =
        Boolean(selectedEmployee);

      if (selectedEmployee) {
        await updateEmployee(
          selectedEmployee.id,
          payload as UpdateEmployeePayload,
        );
      } else {
        await createEmployee(
          payload as CreateEmployeePayload,
        );
      }

      setModalOpen(false);
      setSelectedEmployee(null);

      await loadEmployees();

      showToast({
        type: 'success',
        title: isEditing
          ? 'Employee updated'
          : 'Employee created',
        message: isEditing
          ? 'Employee information was updated successfully.'
          : 'New employee was created successfully.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Save failed',
        message: getErrorMessage(
          error,
          'Failed to save employee.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleStatus(
    employee: Employee,
  ) {
    const nextStatus =
      employee.status === 'active'
        ? 'inactive'
        : 'active';

    const confirmed =
      await confirm({
        title:
          nextStatus === 'inactive'
            ? 'Deactivate employee'
            : 'Activate employee',
        message: `${
          nextStatus === 'inactive'
            ? 'Deactivate'
            : 'Activate'
        } ${employee.firstName}?`,
        confirmText:
          nextStatus === 'inactive'
            ? 'Deactivate'
            : 'Activate',
        tone:
          nextStatus === 'inactive'
            ? 'danger'
            : 'default',
      });

    if (!confirmed) {
      return;
    }

    try {
      await updateEmployeeStatus(
        employee.id,
        nextStatus,
      );

      await loadEmployees();

      showToast({
        type: 'success',
        title:
          nextStatus === 'active'
            ? 'Employee activated'
            : 'Employee deactivated',
        message: `${employee.firstName}'s status was updated successfully.`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Status update failed',
        message: getErrorMessage(
          error,
          'Failed to update employee status.',
        ),
      });
    }
  }

  async function handleCreateAccount(
    employee: Employee,
  ) {
    const confirmed =
      await confirm({
        title: 'Create login account',
        message: `Create a login account for ${employee.firstName}? A temporary password will be generated.`,
        confirmText: 'Create Account',
        tone: 'default',
      });

    if (!confirmed) {
      return;
    }

    try {
      const result =
        await createEmployeeAccount(
          employee.id,
        );

      setCredentialResult({
        email: result.user.email,
        temporaryPassword:
          result.temporaryPassword,
        title: 'Account Created',
      });

      await loadEmployees();

      showToast({
        type: 'success',
        title: 'Account created',
        message: `Login account for ${employee.firstName} was created successfully.`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Account creation failed',
        message: getErrorMessage(
          error,
          'Failed to create employee account.',
        ),
      });
    }
  }

  async function handleResetPassword(
    employee: Employee,
  ) {
    const confirmed =
      await confirm({
        title: 'Reset password',
        message: `Reset the login password for ${employee.firstName}? The current password will no longer work.`,
        confirmText: 'Reset Password',
        tone: 'danger',
      });

    if (!confirmed) {
      return;
    }

    try {
      const result =
        await resetEmployeePassword(
          employee.id,
        );

      setCredentialResult({
        email: result.user.email,
        temporaryPassword:
          result.temporaryPassword,
        title: 'Password Reset',
      });

      showToast({
        type: 'success',
        title: 'Password reset',
        message: `A new temporary password was generated for ${employee.firstName}.`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Password reset failed',
        message: getErrorMessage(
          error,
          'Failed to reset employee password.',
        ),
      });
    }
  }

  async function handleToggleAccountStatus(
    employee: Employee,
  ) {
    if (!employee.user) {
      return;
    }

    const nextStatus =
      !employee.user.isActive;

    const action =
      nextStatus
        ? 'Enable'
        : 'Disable';

    const confirmed =
      await confirm({
        title: nextStatus
          ? 'Enable login account'
          : 'Disable login account',
        message: `${action} login access for ${employee.firstName}?`,
        confirmText: action,
        tone: nextStatus
          ? 'default'
          : 'danger',
      });

    if (!confirmed) {
      return;
    }

    try {
      await updateEmployeeAccountStatus(
        employee.id,
        nextStatus,
      );

      await loadEmployees();

      showToast({
        type: 'success',
        title: nextStatus
          ? 'Login enabled'
          : 'Login disabled',
        message: `${employee.firstName}'s login account was ${
          nextStatus
            ? 'enabled'
            : 'disabled'
        } successfully.`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Account update failed',
        message: getErrorMessage(
          error,
          'Failed to update login account.',
        ),
      });
    }
  }

  const activeCount =
    items.filter(
      (item) =>
        item.status === 'active',
    ).length;

  const inactiveCount =
    items.length -
    activeCount;

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Workforce
          </p>

          <h1>
            Employees
          </h1>

          <p>
            Manage employee profiles,
            assignments, and account
            status.
          </p>
        </div>

        <button
          type="button"
          className="primary-button button-with-icon"
          onClick={
            openCreateModal
          }
        >
          <Plus size={17} />
          Add Employee
        </button>
      </section>

      <section className="mini-stat-grid">
        <MiniStat
          label="Total Employees"
          value={items.length}
          icon={
            <UserRound
              size={18}
            />
          }
        />

        <MiniStat
          label="Active"
          value={activeCount}
          tone="success"
        />

        <MiniStat
          label="Inactive"
          value={inactiveCount}
          tone="neutral"
        />
      </section>

      {error && (
        <div className="error-banner">
          <span>
            {error}
          </span>

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

      <section className="panel-card">
        <div className="employee-toolbar">
          <div className="employee-search">
            <Search size={17} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              placeholder="Search employee, ID, email, department..."
            />
          </div>

          <button
            type="button"
            className="ghost-button button-with-icon"
            onClick={handleSearchSubmit}
          >
            <Search size={15} />
            Search
          </button>

          <select
            className="attendance-filter"
            value={statusFilter}
            onChange={(event) => {
              setPage(1);
              setStatusFilter(
                event.target.value as
                  | 'all'
                  | EmployeeStatus,
              );
            }}
          >
            <option value="all">
              All Status
            </option>
            <option value="active">
              Active
            </option>
            <option value="inactive">
              Inactive
            </option>
          </select>

          <select
            className="attendance-filter"
            value={departmentFilter}
            onChange={(event) => {
              setPage(1);
              setDepartmentFilter(
                event.target.value,
              );
            }}
          >
            <option value="all">
              All Departments
            </option>
            {departments.map(
              (department) => (
                <option
                  key={department.id}
                  value={department.id}
                >
                  {department.name}
                </option>
              ),
            )}
          </select>

          <button
            type="button"
            className="ghost-button button-with-icon"
            onClick={
              loadEmployees
            }
            disabled={isLoading}
          >
            <RefreshCw
              size={15}
              className={
                isLoading
                  ? 'spin'
                  : ''
              }
            />

            Refresh
          </button>
        </div>

        <div className="panel-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />

              <p>
                Loading employees...
              </p>
            </div>
          ) : (
            <EmployeeTable
              items={items}
              onEdit={
                openEditModal
              }
              onToggleStatus={
                handleToggleStatus
              }
              onCreateAccount={
                handleCreateAccount
              }
              onResetPassword={
                handleResetPassword
              }
              onToggleAccountStatus={
                handleToggleAccountStatus
              }
            />
          )}

          <div className="pagination-bar">
            <div className="pagination-info">
              <span>
                Total {pagination.total}
                {' employees'}
              </span>
              <span>
                Page {pagination.page}
                {' of '}
                {Math.max(
                  pagination.totalPages,
                  1,
                )}
              </span>
            </div>

            <div className="pagination-actions">
              <select
                className="attendance-filter"
                value={limit}
                onChange={(event) => {
                  setLimit(
                    Number(
                      event.target.value,
                    ),
                  );
                  setPage(1);
                }}
              >
                <option value={10}>
                  10 / page
                </option>
                <option value={25}>
                  25 / page
                </option>
                <option value={50}>
                  50 / page
                </option>
              </select>

              <button
                type="button"
                className="ghost-button"
                disabled={
                  !pagination.hasPreviousPage ||
                  isLoading
                }
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1),
                  )
                }
              >
                Previous
              </button>

              <button
                type="button"
                className="ghost-button"
                disabled={
                  !pagination.hasNextPage ||
                  isLoading
                }
                onClick={() =>
                  setPage((current) =>
                    current + 1,
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && (
        <EmployeeFormModal
          key={
            selectedEmployee
              ? `edit-${selectedEmployee.id}`
              : 'create'
          }
          employee={
            selectedEmployee
          }
          isSubmitting={
            isSubmitting
          }
          onClose={
            closeModal
          }
          onSubmit={
            handleSubmit
          }
        />
      )}

      {credentialResult && (
        <AccountCredentialModal
          email={
            credentialResult.email
          }
          temporaryPassword={
            credentialResult.temporaryPassword
          }
          title={
            credentialResult.title
          }
          onClose={() =>
            setCredentialResult(null)
          }
        />
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon,
  tone = 'primary',
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  tone?:
    | 'primary'
    | 'success'
    | 'neutral';
}) {
  return (
    <article
      className={`mini-stat mini-stat-${tone}`}
    >
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      {icon && (
        <div className="mini-stat-icon">
          {icon}
        </div>
      )}
    </article>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    axios.isAxiosError(error)
  ) {
    return (
      error.response
        ?.data
        ?.message ??
      fallback
    );
  }

  return fallback;
}
