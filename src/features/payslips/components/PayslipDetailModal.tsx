import {
  Banknote,
  CalendarDays,
  UserRound,
  X,
} from 'lucide-react';

import type {
  Payslip,
} from '../types/payslip.types';

interface Props {
  payslip: Payslip;
  onClose: () => void;
}

export default function PayslipDetailModal({
  payslip,
  onClose,
}: Props) {
  const fullName = [
    payslip.employee.firstName,
    payslip.employee.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  const additionalIncome =
    Number(payslip.totalIncome) -
    Number(payslip.basicSalary);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal-card payslip-detail-modal"
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
              Payslip Details
            </h2>

            <p>
              Payroll summary for this
              employee and period.
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

        <div className="payslip-detail-grid">
          <DetailCard
            icon={<UserRound size={18} />}
            label="Employee"
            value={fullName}
            secondary={
              payslip.employee.employeeNumber
            }
          />

          <DetailCard
            icon={<CalendarDays size={18} />}
            label="Period"
            value={formatPeriod(
              payslip.periodMonth,
              payslip.periodYear,
            )}
            secondary={`Payslip #${payslip.id}`}
          />

          <DetailCard
            icon={<Banknote size={18} />}
            label="Status"
            value={
              payslip.status === 'published'
                ? 'Published'
                : 'Draft'
            }
            secondary="Payroll status"
          />
        </div>

        <section className="request-detail-section">
          <h3>
            Income Summary
          </h3>

          <div className="attendance-info-grid">
            <InfoItem
              label="Basic Salary"
              value={formatCurrency(
                payslip.basicSalary,
              )}
            />

            <InfoItem
              label="Additional Income"
              value={formatCurrency(
                additionalIncome,
              )}
            />

            <InfoItem
              label="Total Income"
              value={formatCurrency(
                payslip.totalIncome,
              )}
            />

            <InfoItem
              label="Total Deduction"
              value={formatCurrency(
                payslip.totalDeduction,
              )}
            />
          </div>
        </section>

        <div className="payslip-take-home">
          <span>
            Take Home Pay
          </span>

          <strong>
            {formatCurrency(
              payslip.takeHomePay,
            )}
          </strong>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="primary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary: string;
}) {
  return (
    <div className="request-detail-card">
      <div className="attendance-detail-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{secondary}</small>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="attendance-info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatCurrency(
  value: string | number,
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