import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  Banknote,
  BellRing,
  Clock3,
  FileClock,
  RefreshCw,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';

import {
  getAdminDashboard,
} from '../api/dashboard.api';

import type {
  AdminDashboard,
  RecentAttendance,
  RecentRequest,
} from '../types/dashboard.types';

export default function DashboardPage() {
  const [
    dashboard,
    setDashboard,
  ] =
    useState<AdminDashboard | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function loadDashboard() {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        await getAdminDashboard();

      setDashboard(data);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to load dashboard.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="page-stack">
        <div className="loading-state">
          <div className="spinner" />

          <p>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="page-stack">
        <div className="error-banner">
          <span>
            {error ??
              'Dashboard data is unavailable.'}
          </span>
        </div>

        <button
          type="button"
          className="primary-button button-with-icon"
          onClick={loadDashboard}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Overview
          </p>

          <h1>
            Dashboard
          </h1>

          <p>
            Real-time workforce overview
            for{' '}
            {formatPeriod(
              dashboard.period.month,
              dashboard.period.year,
            )}
            .
          </p>
        </div>

        <button
          type="button"
          className="ghost-button button-with-icon"
          onClick={loadDashboard}
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

      <section className="dashboard-stat-grid">
        <DashboardStat
          label="Total Employees"
          value={
            dashboard
              .employees
              .total
          }
          icon={
            <UsersRound size={19} />
          }
          description={
            `${dashboard.employees.active} active`
          }
        />

        <DashboardStat
          label="Present Today"
          value={
            dashboard
              .attendance
              .presentToday
          }
          icon={
            <UserRoundCheck
              size={19}
            />
          }
          description={
            `${dashboard.attendance.totalCheckedInToday} checked in`
          }
        />

        <DashboardStat
          label="Late Today"
          value={
            dashboard
              .attendance
              .lateToday
          }
          icon={
            <Clock3 size={19} />
          }
          description="Attendance today"
        />

        <DashboardStat
          label="Pending Requests"
          value={
            dashboard
              .requests
              .pending
          }
          icon={
            <FileClock size={19} />
          }
          description="Awaiting review"
        />
      </section>

      <section className="dashboard-secondary-grid">
        <article className="panel-card dashboard-summary-card">
          <div className="panel-header">
            <div>
              <p className="page-eyebrow">
                Payroll
              </p>

              <h2>
                Monthly Payroll
              </h2>
            </div>

            <Banknote size={20} />
          </div>

          <div className="dashboard-payroll-value">
            {formatCurrency(
              dashboard
                .payroll
                .totalTakeHomePay,
            )}
          </div>

          <div className="dashboard-mini-grid">
            <SummaryItem
              label="Payslips"
              value={
                dashboard
                  .payroll
                  .totalPayslips
              }
            />

            <SummaryItem
              label="Published"
              value={
                dashboard
                  .payroll
                  .published
              }
            />

            <SummaryItem
              label="Draft"
              value={
                dashboard
                  .payroll
                  .draft
              }
            />
          </div>
        </article>

        <article className="panel-card dashboard-summary-card">
          <div className="panel-header">
            <div>
              <p className="page-eyebrow">
                Communication
              </p>

              <h2>
                Announcements
              </h2>
            </div>

            <BellRing size={20} />
          </div>

          <div className="dashboard-big-number">
            {
              dashboard
                .announcements
                .published
            }
          </div>

          <p className="dashboard-summary-text">
            Published announcements
            currently available to employees.
          </p>
        </article>
      </section>

      <section className="dashboard-activity-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="page-eyebrow">
                Attendance
              </p>

              <h2>
                Recent Attendance
              </h2>
            </div>
          </div>

          <div className="panel-content">
            {dashboard
              .recentAttendance
              .length === 0 ? (
              <div className="empty-state">
                <h3>
                  No attendance activity
                </h3>

                <p>
                  Recent attendance will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="dashboard-activity-list">
                {dashboard
                  .recentAttendance
                  .map(
                    (item) => (
                      <AttendanceActivity
                        key={item.id}
                        item={item}
                      />
                    ),
                  )}
              </div>
            )}
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header">
            <div>
              <p className="page-eyebrow">
                Requests
              </p>

              <h2>
                Recent Requests
              </h2>
            </div>
          </div>

          <div className="panel-content">
            {dashboard
              .recentRequests
              .length === 0 ? (
              <div className="empty-state">
                <h3>
                  No recent requests
                </h3>

                <p>
                  Employee requests will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="dashboard-activity-list">
                {dashboard
                  .recentRequests
                  .map(
                    (item) => (
                      <RequestActivity
                        key={item.id}
                        item={item}
                      />
                    ),
                  )}
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

function DashboardStat({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <article className="dashboard-stat-card">
      <div className="dashboard-stat-icon">
        {icon}
      </div>

      <div className="dashboard-stat-copy">
        <span>{label}</span>

        <strong>
          {value}
        </strong>

        <small>
          {description}
        </small>
      </div>
    </article>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="dashboard-summary-item">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function AttendanceActivity({
  item,
}: {
  item: RecentAttendance;
}) {
  return (
    <div className="dashboard-activity-item">
      <div className="employee-avatar">
        {item.employee.name
          .charAt(0)
          .toUpperCase()}
      </div>

      <div className="dashboard-activity-copy">
        <strong>
          {item.employee.name}
        </strong>

        <span>
          {item.employee.employeeNumber}
          {' · '}
          {item.office}
        </span>

        <small>
          {formatDate(
            item.workDate,
          )}
          {' · '}
          {item.checkInTime ??
            '--:--'}
          {' → '}
          {item.checkOutTime ??
            '--:--'}
        </small>
      </div>

      <StatusBadge
        status={item.status}
      />
    </div>
  );
}

function RequestActivity({
  item,
}: {
  item: RecentRequest;
}) {
  return (
    <div className="dashboard-activity-item">
      <div className="employee-avatar">
        {item.employee.name
          .charAt(0)
          .toUpperCase()}
      </div>

      <div className="dashboard-activity-copy">
        <strong>
          {item.employee.name}
        </strong>

        <span>
          {formatRequestType(
            item.type,
          )}
        </span>

        <small>
          Submitted{' '}
          {formatDateTime(
            item.submittedAt,
          )}
        </small>
      </div>

      <StatusBadge
        status={item.status}
      />
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const className =
    status === 'present' ||
    status === 'approved' ||
    status === 'published'
      ? 'dashboard-status-success'
      : status === 'late' ||
          status === 'pending'
        ? 'dashboard-status-warning'
        : 'dashboard-status-danger';

  return (
    <span
      className={`status-badge ${className}`}
    >
      {status}
    </span>
  );
}

function formatRequestType(
  value: string,
) {
  return value
    .replaceAll('_', ' ')
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
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
    new Date(
      year,
      month - 1,
      1,
    ),
  );
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    'en-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(
    new Date(value),
  );
}

function formatDateTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    'en-ID',
    {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(
    new Date(value),
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