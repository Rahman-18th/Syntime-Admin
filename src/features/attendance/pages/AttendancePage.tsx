import {
  useCallback,
  useEffect,
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

import {
  getAttendancesPaginated,
} from '../api/attendances.api';

import AttendanceDetailModal
  from '../components/AttendanceDetailModel';

import AttendanceTable
  from '../components/AttendanceTable';

import type {
  Attendance,
  AttendancePaginationMeta,
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

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [
    appliedSearch,
    setAppliedSearch,
  ] = useState('');

  const [
    pagination,
    setPagination,
  ] = useState<AttendancePaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    summary: {
      totalRecords: 0,
      present: 0,
      late: 0,
      incomplete: 0,
    },
  });

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

  const loadAttendances = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result =
        await getAttendancesPaginated({
          page,
          limit,
          ...(appliedSearch && {
            search: appliedSearch,
          }),
          ...(statusFilter !== 'all' && {
            status: statusFilter,
          }),
          ...(dateFilter && {
            date: dateFilter,
          }),
        });

      setItems(result.data);
      setPagination(result.meta);
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
  }, [
    page,
    limit,
    appliedSearch,
    statusFilter,
    dateFilter,
  ]);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        void loadAttendances();
      }, 0);

    return () =>
      window.clearTimeout(timeoutId);
  }, [loadAttendances]);

  function handleSearchSubmit() {
    const nextSearch = search.trim();

    if (
      page === 1 &&
      nextSearch === appliedSearch
    ) {
      void loadAttendances();
      return;
    }

    setPage(1);
    setAppliedSearch(nextSearch);
  }

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
          onClick={() =>
            void loadAttendances()
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
          value={
            pagination.summary.totalRecords
          }
          icon={
            <CalendarDays
              size={18}
            />
          }
        />

        <AttendanceStat
          label="Present"
          value={pagination.summary.present}
          icon={
            <UserCheck
              size={18}
            />
          }
          tone="success"
        />

        <AttendanceStat
          label="Late"
          value={pagination.summary.late}
          icon={
            <Clock3
              size={18}
            />
          }
          tone="warning"
        />

        <AttendanceStat
          label="Incomplete"
          value={
            pagination.summary.incomplete
          }
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
                event.target
                  .value as StatusFilter,
              );
            }}
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
            onChange={(event) => {
              setPage(1);

              setDateFilter(
                event.target.value,
              );
            }}
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
              items={items}
              onView={
                setSelectedAttendance
              }
            />
          )}
        </div>

        <div className="pagination-bar">
          <div className="pagination-info">
            <span>
              Total {pagination.total}
              {' records'}
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
                  Number(event.target.value),
                );
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
                setPage((current) => current + 1)
              }
            >
              Next
            </button>
          </div>
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