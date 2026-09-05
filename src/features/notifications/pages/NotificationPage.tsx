import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';

import {
  Bell,
  BellRing,
  Mail,
  MailOpen,
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
  createNotification,
  getNotifications,
} from '../api/notification.api';

import NotificationFormModal
  from '../components/NotificationFormModal';

import NotificationTable
  from '../components/NotificationTable';

import type {
  AdminNotification,
  CreateNotificationPayload,
} from '../types/notification.types';

import {
  useToast,
} from '../../../components/toast/useToast';

type ReadFilter =
  | 'all'
  | 'read'
  | 'unread';

type TypeFilter =
  | 'all'
  | 'request_review'
  | 'manual'
  | 'schedule'
  | 'information'
  | 'warning'
  | 'payroll';

export default function NotificationPage() {
  const { showToast } =
    useToast();

  const [
    notifications,
    setNotifications,
  ] =
    useState<AdminNotification[]>([]);

  const [
    employees,
    setEmployees,
  ] =
    useState<Employee[]>([]);

  const [search, setSearch] =
    useState('');

  const [
    readFilter,
    setReadFilter,
  ] =
    useState<ReadFilter>('all');

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState<TypeFilter>('all');

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false);

  const [
    modalOpen,
    setModalOpen,
  ] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [
        notificationData,
        employeeData,
      ] =
        await Promise.all([
          getNotifications(),
          getEmployees(),
        ]);

      setNotifications(
        notificationData,
      );

      setEmployees(
        employeeData,
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to load notifications.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  const filteredNotifications =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return notifications.filter(
        (item) => {
          const employeeName = [
            item.employee.firstName,
            item.employee.lastName,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          const matchesSearch =
            !query ||
            employeeName.includes(query) ||
            item.employee.employeeNumber
              .toLowerCase()
              .includes(query) ||
            item.title
              .toLowerCase()
              .includes(query) ||
            item.message
              .toLowerCase()
              .includes(query);

          const matchesRead =
            readFilter === 'all' ||
            (readFilter === 'read' &&
              item.isRead) ||
            (readFilter === 'unread' &&
              !item.isRead);

          const matchesType =
            typeFilter === 'all' ||
            item.type === typeFilter;

          return (
            matchesSearch &&
            matchesRead &&
            matchesType
          );
        },
      );
    }, [
      notifications,
      search,
      readFilter,
      typeFilter,
    ]);

  async function handleCreate(
    payload: CreateNotificationPayload,
  ) {
    setIsSubmitting(true);

    try {
      const employee =
        employees.find(
          (item) =>
            item.id ===
            payload.employeeId,
        );

      await createNotification(
        payload,
      );

      setModalOpen(false);

      await loadData();

      const employeeName =
        employee
          ? [
              employee.firstName,
              employee.lastName,
            ]
              .filter(Boolean)
              .join(' ')
          : 'employee';

      showToast({
        type: 'success',
        title: 'Notification sent',
        message: `Notification was sent to ${employeeName} successfully.`,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Send failed',
        message: getErrorMessage(
          error,
          'Failed to send notification.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const unreadCount =
    notifications.filter(
      (item) => !item.isRead,
    ).length;

  const readCount =
    notifications.filter(
      (item) => item.isRead,
    ).length;

  const manualCount =
    notifications.filter(
      (item) =>
        item.type === 'manual',
    ).length;

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Communication
          </p>

          <h1>
            Notifications
          </h1>

          <p>
            Monitor employee notifications
            and send direct messages.
          </p>
        </div>

        <button
          type="button"
          className="primary-button button-with-icon"
          onClick={() =>
            setModalOpen(true)
          }
        >
          <Plus size={16} />
          Send Notification
        </button>
      </section>

      <section className="attendance-stat-grid">
        <NotificationStat
          label="Total"
          value={
            notifications.length
          }
          icon={
            <Bell size={18} />
          }
        />

        <NotificationStat
          label="Unread"
          value={unreadCount}
          icon={
            <Mail size={18} />
          }
        />

        <NotificationStat
          label="Read"
          value={readCount}
          icon={
            <MailOpen size={18} />
          }
        />

        <NotificationStat
          label="Manual"
          value={manualCount}
          icon={
            <BellRing size={18} />
          }
        />
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
        <div className="notification-toolbar">
          <div className="employee-search">
            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search employee, title, or message..."
            />
          </div>

          <select
            className="attendance-filter"
            value={readFilter}
            onChange={(event) =>
              setReadFilter(
                event.target
                  .value as ReadFilter,
              )
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="unread">
              Unread
            </option>

            <option value="read">
              Read
            </option>
          </select>

          <select
            className="attendance-filter"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target
                  .value as TypeFilter,
              )
            }
          >
            <option value="all">
              All Types
            </option>

            <option value="request_review">
              Request Review
            </option>

            <option value="manual">
              Manual
            </option>

            <option value="schedule">
              Schedule
            </option>

            <option value="information">
              Information
            </option>

            <option value="warning">
              Warning
            </option>

            <option value="payroll">
              Payroll
            </option>
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
                Loading notifications...
              </p>
            </div>
          ) : (
            <NotificationTable
              items={
                filteredNotifications
              }
            />
          )}
        </div>
      </section>

      {modalOpen && (
        <NotificationFormModal
          employees={employees}
          isSubmitting={
            isSubmitting
          }
          onClose={() => {
            if (!isSubmitting) {
              setModalOpen(false);
            }
          }}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}

function NotificationStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <article className="mini-stat">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="mini-stat-icon">
        {icon}
      </div>
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