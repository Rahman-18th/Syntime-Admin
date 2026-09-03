import {
  useEffect,
  useMemo,
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
  getEmployees,
  resetEmployeePassword,
  updateEmployee,
  updateEmployeeAccountStatus,
  updateEmployeeStatus,
} from '../api/employee.api';

import EmployeeFormModal
  from '../components/EmployeeFormModal';

import EmployeeTable
  from '../components/EmployeeTable';

import type {
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
} from '../types/employee.types';

import AccountCredentialModal
  from '../components/AccountCredentialModal';

export default function EmployeePage() {
  const [items, setItems] =
    useState<Employee[]>([]);

  const [search, setSearch] =
    useState('');

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

  useEffect(() => {
    void loadEmployees();
  }, []);

  async function loadEmployees() {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        await getEmployees();

      setItems(data);
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
  }

  const filteredItems =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return items;
      }

      return items.filter(
        (item) => {
          const fullName = [
            item.firstName,
            item.lastName,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return (
            fullName.includes(query) ||
            item.employeeNumber
              .toLowerCase()
              .includes(query) ||
            item.email
              .toLowerCase()
              .includes(query) ||
            item.department?.name
              ?.toLowerCase()
              .includes(query) ||
            item.position
              ?.toLowerCase()
              .includes(query)
          );
        },
      );
    }, [
      items,
      search,
    ]);

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
    setError(null);

    try {
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
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to save employee.',
        ),
      );
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
      window.confirm(
        `${nextStatus === 'inactive'
          ? 'Deactivate'
          : 'Activate'} ${employee.firstName}?`,
      );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      await updateEmployeeStatus(
        employee.id,
        nextStatus,
      );

      await loadEmployees();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to update employee status.',
        ),
      );
    }
  }

  async function handleCreateAccount(
    employee: Employee,
  ) {
    const confirmed =
      window.confirm(
        `Create login account for ${employee.firstName}?`,
      );

    if (!confirmed) {
      return;
    }

    setError(null);

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
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to create employee account.',
        ),
      );
    }
  }

  async function handleResetPassword(
    employee: Employee,
  ) {
    const confirmed =
      window.confirm(
        `Reset password for ${employee.firstName}?`,
      );

    if (!confirmed) {
      return;
    }

    setError(null);

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
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to reset employee password.',
        ),
      );
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
      window.confirm(
        `${action} login for ${employee.firstName}?`,
      );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      await updateEmployeeAccountStatus(
        employee.id,
        nextStatus,
      );

      await loadEmployees();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to update login account.',
        ),
      );
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
              placeholder="Search employee, ID, email, department..."
            />
          </div>

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
              items={
                filteredItems
              }
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
