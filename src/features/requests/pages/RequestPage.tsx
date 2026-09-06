import {
  useCallback,
  useEffect,
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
  getRequestsPaginated,
  reviewRequest,
} from '../api/request.api';

import RequestDetailModal
  from '../components/RequestDetailModal';

import RequestTable
  from '../components/RequestTable';

import type {
  EmployeeRequest,
  RequestPaginationMeta,
  ReviewRequestPayload,
} from '../types/request.types';

import {
  useToast,
} from '../../../components/toast/useToast';

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
  const { showToast } =
    useToast();

  const [items, setItems] =
    useState<EmployeeRequest[]>([]);

  const [search, setSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState(10);

  const [appliedSearch, setAppliedSearch] =
    useState('');

  const [pagination, setPagination] =
    useState<RequestPaginationMeta>({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      summary: {
        totalRequests: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
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

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getRequestsPaginated({
        page,
        limit,
        ...(appliedSearch && { search: appliedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
      });

      setItems(result.data);
      setPagination(result.meta);
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
  }, [
    page,
    limit,
    appliedSearch,
    statusFilter,
    typeFilter,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadRequests();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRequests]);

  function handleSearchSubmit() {
    const nextSearch = search.trim();

    if (page === 1 && nextSearch === appliedSearch) {
      void loadRequests();
      return;
    }

    setPage(1);
    setAppliedSearch(nextSearch);
  }

  async function handleReview(
    payload: ReviewRequestPayload,
  ) {
    if (!selectedRequest) {
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewedRequest =
        selectedRequest;

      await reviewRequest(
        reviewedRequest.id,
        payload,
      );

      setSelectedRequest(null);

      await loadRequests();

      const employeeName = [
        reviewedRequest.employee.firstName,
        reviewedRequest.employee.lastName,
      ]
        .filter(Boolean)
        .join(' ');

      if (
        payload.status === 'approved'
      ) {
        showToast({
          type: 'success',
          title: 'Request approved',
          message: `${employeeName}'s request was approved successfully.`,
        });
      } else {
        showToast({
          type: 'success',
          title: 'Request rejected',
          message: `${employeeName}'s request was rejected successfully.`,
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Review failed',
        message: getErrorMessage(
          error,
          'Failed to review request.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const {
    totalRequests,
    pending,
    approved,
    rejected,
  } = pagination.summary;

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
          onClick={() => void loadRequests()}
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
          value={totalRequests}
        />

        <RequestStat
          label="Pending"
          value={pending}
          icon={<Clock3 size={18} />}
          tone="warning"
        />

        <RequestStat
          label="Approved"
          value={approved}
          icon={
            <CheckCircle2
              size={18}
            />
          }
          tone="success"
        />

        <RequestStat
          label="Rejected"
          value={rejected}
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
            onChange={(event) => {
              setPage(1);
              setTypeFilter(
                event.target.value as TypeFilter,
              );
            }}
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
              items={items}
              onView={
                setSelectedRequest
              }
            />
          )}
        </div>

        <div className="pagination-bar">
          <div className="pagination-info">
            <span>
              Total {pagination.total} requests
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