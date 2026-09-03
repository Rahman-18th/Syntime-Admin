import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';

import {
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react';

import {
  getRequests,
  reviewRequest,
} from '../api/request.api';

import RequestDetailModal
  from '../components/RequestDetailModal';

import RequestTable
  from '../components/RequestTable';

import type {
  EmployeeRequest,
  ReviewRequestPayload,
} from '../types/request.types';

type StatusFilter =
  | 'all'
  | 'pending'
  | 'approved'
  | 'rejected';

type TypeFilter =
  | 'all'
  | 'leave'
  | 'permission'
  | 'attendance_correction';

export default function RequestPage() {
  const [items, setItems] =
    useState<EmployeeRequest[]>([]);

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
    typeFilter,
    setTypeFilter,
  ] =
    useState<TypeFilter>(
      'all',
    );

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
    selectedRequest,
    setSelectedRequest,
  ] =
    useState<EmployeeRequest | null>(
      null,
    );

  useEffect(() => {
    void loadRequests();
  }, []);

  async function loadRequests() {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        await getRequests();

      setItems(data);
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to load requests.',
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
            item.employee
              .employeeNumber
              .toLowerCase()
              .includes(query) ||
            item.employee.email
              .toLowerCase()
              .includes(query);

          const matchesStatus =
            statusFilter === 'all' ||
            item.status ===
              statusFilter;

          const matchesType =
            typeFilter === 'all' ||
            item.type ===
              typeFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesType
          );
        },
      );
    }, [
      items,
      search,
      statusFilter,
      typeFilter,
    ]);

  async function handleReview(
    payload: ReviewRequestPayload,
  ) {
    if (!selectedRequest) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await reviewRequest(
        selectedRequest.id,
        payload,
      );

      setSelectedRequest(null);

      await loadRequests();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          'Failed to review request.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const pendingCount =
    items.filter(
      (item) =>
        item.status === 'pending',
    ).length;

  const approvedCount =
    items.filter(
      (item) =>
        item.status === 'approved',
    ).length;

  const rejectedCount =
    items.filter(
      (item) =>
        item.status === 'rejected',
    ).length;

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Workforce
          </p>

          <h1>
            Requests
          </h1>

          <p>
            Review employee leave,
            permission, and attendance
            correction requests.
          </p>
        </div>

        <button
          type="button"
          className="ghost-button button-with-icon"
          onClick={loadRequests}
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
        <RequestStat
          label="Total Requests"
          value={items.length}
        />

        <RequestStat
          label="Pending"
          value={pendingCount}
          icon={<Clock3 size={18} />}
          tone="warning"
        />

        <RequestStat
          label="Approved"
          value={approvedCount}
          icon={
            <CheckCircle2
              size={18}
            />
          }
          tone="success"
        />

        <RequestStat
          label="Rejected"
          value={rejectedCount}
          icon={
            <XCircle size={18} />
          }
          tone="danger"
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
        <div className="request-toolbar">
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

            <option value="pending">
              Pending
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="rejected">
              Rejected
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

            <option value="leave">
              Leave
            </option>

            <option value="permission">
              Permission
            </option>

            <option value="attendance_correction">
              Attendance Correction
            </option>
          </select>
        </div>

        <div className="panel-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />

              <p>
                Loading requests...
              </p>
            </div>
          ) : (
            <RequestTable
              items={
                filteredItems
              }
              onView={
                setSelectedRequest
              }
            />
          )}
        </div>
      </section>

      {selectedRequest && (
        <RequestDetailModal
          key={
            selectedRequest.id
          }
          request={
            selectedRequest
          }
          isSubmitting={
            isSubmitting
          }
          onClose={() => {
            if (!isSubmitting) {
              setSelectedRequest(
                null,
              );
            }
          }}
          onReview={
            handleReview
          }
        />
      )}
    </div>
  );
}

function RequestStat({
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
    | 'warning'
    | 'success'
    | 'danger';
}) {
  return (
    <article
      className={`mini-stat request-stat-${tone}`}
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