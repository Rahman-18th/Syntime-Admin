import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  Banknote,
  FileCheck2,
  FileClock,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';

import {
  getEmployees,
} from '../../employees/api/employee.api';

import type {
  Employee,
} from '../../employees/types/employee.types';

import {
  createPayslip,
  getPayslipsPaginated,
  updatePayslip,
} from '../api/payslip.api';

import PayslipDetailModal
  from '../components/PayslipDetailModal';

import PayslipFormModal
  from '../components/PayslipFormModal';

import PayslipTable
  from '../components/PayslipTable';

import type {
  CreatePayslipPayload,
  Payslip,
  PayslipPaginationMeta,
  UpdatePayslipPayload,
} from '../types/payslip.types';

import {
  useToast,
} from '../../../components/toast/useToast';

type StatusFilter =
  | 'all'
  | 'draft'
  | 'published';

export default function PayslipPage() {
  const { showToast } =
    useToast();

  const [items, setItems] =
    useState<Payslip[]>([]);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [search, setSearch] =
    useState('');

  const [appliedSearch, setAppliedSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [pagination, setPagination] =
    useState<PayslipPaginationMeta>({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      summary: {
        totalRecords: 0,
        published: 0,
        draft: 0,
        totalTakeHomePay: 0,
      },
    });

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>('all');

  const [
    monthFilter,
    setMonthFilter,
  ] =
    useState('all');

  const [
    yearFilter,
    setYearFilter,
  ] =
    useState('all');

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [
    selectedPayslip,
    setSelectedPayslip,
  ] =
    useState<Payslip | null>(null);

  const [
    detailPayslip,
    setDetailPayslip,
  ] =
    useState<Payslip | null>(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const loadPayslips = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPayslipsPaginated({
        page,
        limit,
        ...(appliedSearch && { search: appliedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(monthFilter !== 'all' && { month: Number(monthFilter) }),
        ...(yearFilter !== 'all' && { year: Number(yearFilter) }),
      });

      setItems(result.data);
      setPagination(result.meta);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to load payroll data.',
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
    monthFilter,
    yearFilter,
  ]);

  const loadEmployees = useCallback(async () => {
    try {
      const employeeData = await getEmployees();
      setEmployees(employeeData);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Employee load failed',
        message: getErrorMessage(
          error,
          'Failed to load employees.',
        ),
      });
    }
  }, [showToast]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadEmployees();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadEmployees]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadPayslips();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPayslips]);

  function handleSearchSubmit() {
    const nextSearch = search.trim();

    if (page === 1 && nextSearch === appliedSearch) {
      void loadPayslips();
      return;
    }

    setPage(1);
    setAppliedSearch(nextSearch);
  }

  const currentYear = new Date().getFullYear();

  const years =
    Array.from(
      { length: 11 },
      (_, index) => currentYear - 5 + index,
    ).sort(
      (a, b) => b - a,
    );

  function openCreate() {
    setSelectedPayslip(null);
    setModalOpen(true);
  }

  function openEdit(
    payslip: Payslip,
  ) {
    setSelectedPayslip(
      payslip,
    );

    setModalOpen(true);
  }

  async function handleSubmit(
    payload:
      | CreatePayslipPayload
      | UpdatePayslipPayload,
  ) {
    setIsSubmitting(true);

    try {
      const isEditing =
        Boolean(selectedPayslip);

      if (selectedPayslip) {
        await updatePayslip(
          selectedPayslip.id,
          payload as UpdatePayslipPayload,
        );
      } else {
        await createPayslip(
          payload as CreatePayslipPayload,
        );
      }

      setModalOpen(false);
      setSelectedPayslip(null);

      await loadPayslips();

      showToast({
        type: 'success',
        title: isEditing
          ? 'Payslip updated'
          : 'Payslip created',
        message: isEditing
          ? 'Payslip information was updated successfully.'
          : 'New payslip was created successfully.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Payslip save failed',
        message: getErrorMessage(
          error,
          'Failed to save payslip.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const {
    totalRecords,
    published,
    draft,
    totalTakeHomePay,
  } = pagination.summary;

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Payroll
          </p>

          <h1>
            Payslips
          </h1>

          <p>
            Manage employee payroll,
            deductions, and publication
            status.
          </p>
        </div>

        <button
          type="button"
          className="primary-button button-with-icon"
          onClick={openCreate}
        >
          <Plus size={17} />
          New Payslip
        </button>
      </section>

      <section className="attendance-stat-grid">
        <PayrollStat
          label="Total Records"
          value={totalRecords}
          icon={
            <Banknote size={18} />
          }
        />

        <PayrollStat
          label="Published"
          value={published}
          icon={
            <FileCheck2 size={18} />
          }
        />

        <PayrollStat
          label="Draft"
          value={draft}
          icon={
            <FileClock size={18} />
          }
        />

        <article className="mini-stat">
          <div>
            <span>
              Total Take Home Pay
            </span>

            <strong className="payroll-total">
              {formatCurrency(
                totalTakeHomePay,
              )}
            </strong>
          </div>
        </article>
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

      <section className="panel-card">
        <div className="payslip-toolbar">
          <div className="employee-search">
            <Search size={17} />

            <input
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
              placeholder="Search employee..."
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
                event.target.value as StatusFilter,
              );
            }}
          >
            <option value="all">
              All Status
            </option>
            <option value="draft">
              Draft
            </option>
            <option value="published">
              Published
            </option>
          </select>

          <select
            className="attendance-filter"
            value={monthFilter}
            onChange={(event) => {
              setPage(1);
              setMonthFilter(event.target.value);
            }}
          >
            <option value="all">
              All Months
            </option>

            {Array.from(
              { length: 12 },
              (_, index) => (
                <option
                  key={index + 1}
                  value={index + 1}
                >
                  {new Intl.DateTimeFormat(
                    'en-ID',
                    {
                      month: 'long',
                    },
                  ).format(
                    new Date(
                      2026,
                      index,
                      1,
                    ),
                  )}
                </option>
              ),
            )}
          </select>

          <select
            className="attendance-filter"
            value={yearFilter}
            onChange={(event) => {
              setPage(1);
              setYearFilter(event.target.value);
            }}
          >
            <option value="all">
              All Years
            </option>

            {years.map(
              (year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ),
            )}
          </select>

          <button
            type="button"
            className="ghost-button button-with-icon"
            onClick={() => void loadPayslips()}
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
                Loading payslips...
              </p>
            </div>
          ) : (
            <PayslipTable
              items={items}
              onView={
                setDetailPayslip
              }
              onEdit={openEdit}
            />
          )}
        </div>

        <div className="pagination-bar">
          <div className="pagination-info">
            <span>
              Total {pagination.total} payslips
            </span>

            <span>
              Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
            </span>
          </div>

          <div className="pagination-actions">
            <select
              className="attendance-filter"
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>

            <button
              type="button"
              className="ghost-button"
              disabled={!pagination.hasPreviousPage || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </button>

            <button
              type="button"
              className="ghost-button"
              disabled={!pagination.hasNextPage || isLoading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <PayslipFormModal
          key={
            selectedPayslip
              ? `edit-${selectedPayslip.id}`
              : 'create'
          }
          payslip={selectedPayslip}
          employees={employees}
          isSubmitting={isSubmitting}
          onClose={() => {
            if (!isSubmitting) {
              setModalOpen(false);
              setSelectedPayslip(null);
            }
          }}
          onSubmit={handleSubmit}
        />
      )}

      {detailPayslip && (
        <PayslipDetailModal
          payslip={detailPayslip}
          onClose={() =>
            setDetailPayslip(null)
          }
        />
      )}
    </div>
  );
}

function PayrollStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <article className="mini-stat">
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

function formatCurrency(
  value: number,
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    },
  ).format(value);
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