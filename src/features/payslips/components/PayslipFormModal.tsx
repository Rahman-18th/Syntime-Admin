import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import type {
  Employee,
} from '../../employees/types/employee.types';

import type {
  CreatePayslipPayload,
  Payslip,
  PayslipStatus,
  UpdatePayslipPayload,
} from '../types/payslip.types';

interface Props {
  payslip?: Payslip | null;
  employees: Employee[];
  isSubmitting: boolean;

  onClose: () => void;

  onSubmit: (
    payload:
      | CreatePayslipPayload
      | UpdatePayslipPayload,
  ) => Promise<void>;
}

export default function PayslipFormModal({
  payslip,
  employees,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const editing =
    payslip != null;

  const [employeeId, setEmployeeId] =
    useState(
      payslip?.employeeId ?? '',
    );

  const [periodMonth, setPeriodMonth] =
    useState(
      payslip?.periodMonth ??
        new Date().getMonth() + 1,
    );

  const [periodYear, setPeriodYear] =
    useState(
      payslip?.periodYear ??
        new Date().getFullYear(),
    );

  const [basicSalary, setBasicSalary] =
    useState(
      payslip?.basicSalary ?? '',
    );

  const [totalIncome, setTotalIncome] =
    useState(
      payslip?.totalIncome ?? '',
    );

  const [
    totalDeduction,
    setTotalDeduction,
  ] =
    useState(
      payslip?.totalDeduction ?? '',
    );

  const [status, setStatus] =
    useState<PayslipStatus>(
      payslip?.status ?? 'draft',
    );

  const takeHomePay =
    Math.max(
      0,
      Number(totalIncome || 0) -
        Number(totalDeduction || 0),
    );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (editing) {
      const payload:
        UpdatePayslipPayload = {
          basicSalary:
            Number(basicSalary),

          totalIncome:
            Number(totalIncome),

          totalDeduction:
            Number(totalDeduction),

          status,
        };

      await onSubmit(payload);

      return;
    }

    const payload:
      CreatePayslipPayload = {
        employeeId,
        periodMonth,
        periodYear,

        basicSalary:
          Number(basicSalary),

        totalIncome:
          Number(totalIncome),

        totalDeduction:
          Number(totalDeduction),

        status,
      };

    await onSubmit(payload);
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal-card payslip-form-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Payroll
            </p>

            <h2>
              {editing
                ? 'Edit Payslip'
                : 'New Payslip'}
            </h2>

            <p>
              Manage payroll totals and
              publication status.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form
          className="form-stack"
          onSubmit={handleSubmit}
        >
          <label className="form-field">
            <span>Employee</span>

            <select
              value={employeeId}
              disabled={editing}
              required
              onChange={(event) =>
                setEmployeeId(
                  event.target.value,
                )
              }
            >
              <option value="">
                Select employee
              </option>

              {employees.map(
                (employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.employeeNumber}
                    {' - '}
                    {employee.firstName}
                    {employee.lastName
                      ? ` ${employee.lastName}`
                      : ''}
                  </option>
                ),
              )}
            </select>
          </label>

          <div className="form-grid">
            <label className="form-field">
              <span>Month</span>

              <select
                value={periodMonth}
                disabled={editing}
                onChange={(event) =>
                  setPeriodMonth(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              >
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
            </label>

            <label className="form-field">
              <span>Year</span>

              <input
                type="number"
                value={periodYear}
                disabled={editing}
                min="2000"
                max="2100"
                onChange={(event) =>
                  setPeriodYear(
                    Number(
                      event.target.value,
                    ),
                  )
                }
              />
            </label>
          </div>

          <label className="form-field">
            <span>
              Basic Salary
            </span>

            <input
              type="number"
              min="0"
              value={basicSalary}
              onChange={(event) =>
                setBasicSalary(
                  event.target.value,
                )
              }
              required
            />
          </label>

          <div className="form-grid">
            <label className="form-field">
              <span>
                Total Income
              </span>

              <input
                type="number"
                min="0"
                value={totalIncome}
                onChange={(event) =>
                  setTotalIncome(
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label className="form-field">
              <span>
                Total Deduction
              </span>

              <input
                type="number"
                min="0"
                value={
                  totalDeduction
                }
                onChange={(event) =>
                  setTotalDeduction(
                    event.target.value,
                  )
                }
                required
              />
            </label>
          </div>

          <div className="payslip-preview">
            <span>
              Estimated Take Home Pay
            </span>

            <strong>
              {formatCurrency(
                takeHomePay,
              )}
            </strong>
          </div>

          <label className="form-field">
            <span>Status</span>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as PayslipStatus,
                )
              }
            >
              <option value="draft">
                Draft
              </option>

              <option value="published">
                Published
              </option>
            </select>
          </label>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : editing
                  ? 'Save Changes'
                  : 'Create Payslip'}
            </button>
          </div>
        </form>
      </div>
    </div>
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