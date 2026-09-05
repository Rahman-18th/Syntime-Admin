import {
  useEffect,
  useMemo,
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
  getPayslips,
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

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [
        payslipData,
        employeeData,
      ] =
        await Promise.all([
          getPayslips(),
          getEmployees(),
        ]);

      setItems(payslipData);
      setEmployees(employeeData);
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
  }

  const filteredItems =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return items.filter(
        (item) => {
          const fullName = [
            item.employee.firstName,
            item.employee.lastName,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          const matchesSearch =
            !query ||
            fullName.includes(query) ||
            item.employee.employeeNumber
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === 'all' ||
            item.status ===
              statusFilter;

          const matchesMonth =
            monthFilter === 'all' ||
            item.periodMonth ===
              Number(monthFilter);

          const matchesYear =
            yearFilter === 'all' ||
            item.periodYear ===
              Number(yearFilter);

          return (
            matchesSearch &&
            matchesStatus &&
            matchesMonth &&
            matchesYear
          );
        },
      );
    }, [
      items,
      search,
      statusFilter,
      monthFilter,
      yearFilter,
    ]);

  const years =
    Array.from(
      new Set(
        items.map(
          (item) =>
            item.periodYear,
        ),
      ),
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

      await loadData();

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

  const publishedCount =
    items.filter(
      (item) =>
        item.status ===
        'published',
    ).length;

  const draftCount =
    items.filter(
      (item) =>
        item.status ===
        'draft',
    ).length;

  const totalPayroll =
    items.reduce(
      (total, item) =>
        total +
        Number(
          item.takeHomePay,
        ),
      0,
    );

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
          value={items.length}
          icon={
            <Banknote size={18} />
          }
        />

        <PayrollStat
          label="Published"
          value={publishedCount}
          icon={
            <FileCheck2 size={18} />
          }
        />

        <PayrollStat
          label="Draft"
          value={draftCount}
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
                totalPayroll,
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
              placeholder="Search employee..."
            />
          </div>

          <select
            className="attendance-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value as StatusFilter,
              )
            }
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
            onChange={(event) =>
              setMonthFilter(
                event.target.value,
              )
            }
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
            onChange={(event) =>
              setYearFilter(
                event.target.value,
              )
            }
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
            onClick={loadData}
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
              items={filteredItems}
              onView={
                setDetailPayslip
              }
              onEdit={openEdit}
            />
          )}
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