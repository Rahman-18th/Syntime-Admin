import {
  Eye,
  Pencil,
} from 'lucide-react';

import type {
  Payslip,
} from '../types/payslip.types';

interface PayslipTableProps {
  items: Payslip[];

  onView: (
    payslip: Payslip,
  ) => void;

  onEdit: (
    payslip: Payslip,
  ) => void;
}

export default function PayslipTable({
  items,
  onView,
  onEdit,
}: PayslipTableProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          💰
        </div>

        <h3>
          No payslips found
        </h3>

        <p>
          No payroll records match
          the current filters.
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
            <th>Period</th>
            <th>Total Income</th>
            <th>Deduction</th>
            <th>Take Home Pay</th>
            <th>Status</th>
            <th className="table-action-column">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const fullName = [
              item.employee.firstName,
              item.employee.lastName,
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <tr key={item.id}>
                <td>
                  <div className="employee-cell">
                    <div className="employee-avatar">
                      {item.employee.firstName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="employee-copy">
                      <strong>
                        {fullName}
                      </strong>

                      <span>
                        {
                          item.employee
                            .employeeNumber
                        }
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  {formatPeriod(
                    item.periodMonth,
                    item.periodYear,
                  )}
                </td>

                <td>
                  {formatCurrency(
                    item.totalIncome,
                  )}
                </td>

                <td>
                  {formatCurrency(
                    item.totalDeduction,
                  )}
                </td>

                <td>
                  <strong className="payslip-thp">
                    {formatCurrency(
                      item.takeHomePay,
                    )}
                  </strong>
                </td>

                <td>
                  <span
                    className={
                      item.status ===
                      'published'
                        ? 'status-badge status-published'
                        : 'status-badge status-draft'
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="table-action-button"
                      onClick={() =>
                        onView(item)
                      }
                      title="View payslip"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      type="button"
                      className="table-action-button"
                      onClick={() =>
                        onEdit(item)
                      }
                      title="Edit payslip"
                    >
                      <Pencil size={16} />
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

function formatPeriod(
  month: number,
  year: number,
) {
  return new Intl.DateTimeFormat(
    'en-ID',
    {
      month: 'long',
      year: 'numeric',
    },
  ).format(
    new Date(year, month - 1, 1),
  );
}

function formatCurrency(
  value: string,
) {
  return new Intl.NumberFormat(
    'id-ID',
    {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    },
  ).format(Number(value));
}