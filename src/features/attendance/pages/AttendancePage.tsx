import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';

import {
  CalendarDays,
  Clock3,
  RefreshCw,
  Search,
  UserCheck,
} from 'lucide-react';

import { getAttendances } from '../api/attendances.api';

import AttendanceDetailModal
  from '../components/AttendanceDetailModel';

import AttendanceTable
  from '../components/AttendanceTable';

import type {
  Attendance,
} from '../types/attendance.types';

type StatusFilter =
  | 'all'
  | 'present'
  | 'late';

export default function AttendancePage() {
  const [items, setItems] =
    useState<Attendance[]>([]);

  const [search, setSearch] =
    useState('');

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      'all',
    );

  const [
    dateFilter,
    setDateFilter,
  ] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [
    selectedAttendance,
    setSelectedAttendance,
  ] =
    useState<Attendance | null>(
      null,
    );

  useEffect(() => {
    void loadAttendances();
  }, []);

  async function loadAttendances() {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        await getAttendances();

      setItems(data);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to load attendance records.',
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
          const employee =
            item.schedule.employee;

          const fullName = [
            employee.firstName,
            employee.lastName,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          const matchesSearch =
            !query ||
            fullName.includes(query) ||
            employee.employeeNumber
              .toLowerCase()
              .includes(query) ||
            employee.email
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === 'all' ||
            item.status ===
              statusFilter;

          const workDate =
            item.schedule.workDate
              .slice(0, 10);

          const matchesDate =
            !dateFilter ||
            workDate === dateFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesDate
          );
        },
      );
    }, [
      items,
      search,
      statusFilter,
      dateFilter,
    ]);

  const presentCount =
    items.filter(
      (item) =>
        item.status ===
        'present',
    ).length;

  const lateCount =
    items.filter(
      (item) =>
        item.status === 'late',
    ).length;

  const incompleteCount =
    items.filter(
      (item) =>
        item.checkOutAt == null,
    ).length;

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Workforce
          </p>

          <h1>
            Attendance
          </h1>

          <p>
            Monitor employee attendance,
            clock activity, and location
            validation.
          </p>
        </div>

        <button
          type="button"
          className="ghost-button button-with-icon"
          onClick={
            loadAttendances
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
      </section>

      <section className="attendance-stat-grid">
        <AttendanceStat
          label="Total Records"
          value={items.length}
          icon={
            <CalendarDays
              size={18}
            />
          }
        />

        <AttendanceStat
          label="Present"
          value={presentCount}
          icon={
            <UserCheck
              size={18}
            />
          }
          tone="success"
        />

        <AttendanceStat
          label="Late"
          value={lateCount}
          icon={
            <Clock3
              size={18}
            />
          }
          tone="warning"
        />

        <AttendanceStat
          label="Incomplete"
          value={incompleteCount}
          tone="neutral"
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
        <div className="attendance-toolbar">
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

            <option value="present">
              Present
            </option>

            <option value="late">
              Late
            </option>
          </select>

          <input
            type="date"
            className="attendance-filter"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(
                event.target.value,
              )
            }
          />
        </div>

        <div className="panel-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />

              <p>
                Loading attendance records...
              </p>
            </div>
          ) : (
            <AttendanceTable
              items={
                filteredItems
              }
              onView={
                setSelectedAttendance
              }
            />
          )}
        </div>
      </section>

      {selectedAttendance && (
        <AttendanceDetailModal
          attendance={
            selectedAttendance
          }
          onClose={() =>
            setSelectedAttendance(
              null,
            )
          }
        />
      )}
    </div>
  );
}

function AttendanceStat({
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
    | 'warning'
    | 'neutral';
}) {
  return (
    <article
      className={`mini-stat attendance-stat-${tone}`}
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