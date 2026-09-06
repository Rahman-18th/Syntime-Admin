import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  History,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react';

import {
  getAuditLogs,
} from '../api/audit-log.api';

import AuditLogTable from '../components/AuditLogTable';
import AuditLogDetailModal from '../components/AuditLogDetailModal';

import type {
  AuditLog,
  AuditPaginationMeta,
} from '../types/audit-log.types';

export default function AuditLogPage() {
  const [items, setItems] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [pagination, setPagination] = useState<AuditPaginationMeta>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAuditLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getAuditLogs({
        page,
        limit,
        ...(appliedSearch && { search: appliedSearch }),
        ...(actionFilter !== 'all' && { action: actionFilter }),
        ...(entityFilter !== 'all' && { entityType: entityFilter }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });

      setItems(result.data);
      setPagination(result.meta);
    } catch (error) {
      setError(getErrorMessage(error, 'Failed to load audit logs.'));
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    limit,
    appliedSearch,
    actionFilter,
    entityFilter,
    dateFrom,
    dateTo,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAuditLogs();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAuditLogs]);

  function handleSearchSubmit() {
    const nextSearch = search.trim();

    if (page === 1 && nextSearch === appliedSearch) {
      void loadAuditLogs();
      return;
    }

    setPage(1);
    setAppliedSearch(nextSearch);
  }

  function handleFilterChange(
    setter: (value: string) => void,
    value: string,
  ) {
    setPage(1);
    setter(value);
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">Security</p>
          <h1>Audit Logs</h1>
          <p>Track administrative actions and security-sensitive changes.</p>
        </div>

        <button
          type="button"
          className="ghost-button button-with-icon"
          disabled={isLoading}
          onClick={() => void loadAuditLogs()}
        >
          <RefreshCw size={15} className={isLoading ? 'spin' : ''} />
          Refresh
        </button>
      </section>

      <section className="mini-stat-grid">
        <article className="mini-stat">
          <div>
            <span>Matching Logs</span>
            <strong>{pagination.total}</strong>
          </div>
          <div className="mini-stat-icon">
            <History size={18} />
          </div>
        </article>

        <article className="mini-stat">
          <div>
            <span>Security Tracking</span>
            <strong>Active</strong>
          </div>
          <div className="mini-stat-icon">
            <ShieldCheck size={18} />
          </div>
        </article>
      </section>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      <section className="panel-card">
        <div className="audit-toolbar">
          <div className="employee-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
              placeholder="Search actor, action, entity..."
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
            value={actionFilter}
            onChange={(event) =>
              handleFilterChange(setActionFilter, event.target.value)
            }
          >
            <option value="all">All Actions</option>
            <option value="employee.created">Employee Created</option>
            <option value="employee.updated">Employee Updated</option>
            <option value="employee.status_changed">Employee Status</option>
            <option value="employee.account_created">Account Created</option>
            <option value="employee.password_reset">Password Reset</option>
            <option value="request.approved">Request Approved</option>
            <option value="request.rejected">Request Rejected</option>
            <option value="payslip.created">Payslip Created</option>
            <option value="payslip.updated">Payslip Updated</option>
            <option value="rbac.permission_assigned">Permission Assigned</option>
            <option value="rbac.permission_removed">Permission Removed</option>
            <option value="rbac.role_assigned">Role Assigned</option>
            <option value="rbac.role_removed">Role Removed</option>
            <option value="settings.updated">Settings Updated</option>
          </select>

          <select
            className="attendance-filter"
            value={entityFilter}
            onChange={(event) =>
              handleFilterChange(setEntityFilter, event.target.value)
            }
          >
            <option value="all">All Entities</option>
            <option value="employee">Employee</option>
            <option value="request">Request</option>
            <option value="payslip">Payslip</option>
            <option value="company">Company</option>
            <option value="department">Department</option>
            <option value="office">Office</option>
            <option value="role">Role</option>
            <option value="user">User</option>
            <option value="settings">Settings</option>
          </select>

          <input
            type="date"
            className="attendance-filter"
            value={dateFrom}
            onChange={(event) => handleFilterChange(setDateFrom, event.target.value)}
          />
          <input
            type="date"
            className="attendance-filter"
            value={dateTo}
            onChange={(event) => handleFilterChange(setDateTo, event.target.value)}
          />
        </div>

        <div className="panel-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading audit logs...</p>
            </div>
          ) : (
            <AuditLogTable items={items} onView={setSelectedAudit} />
          )}
        </div>

        <div className="pagination-bar">
          <div className="pagination-info">
            <span>Total {pagination.total} logs</span>
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
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
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

      {selectedAudit && (
        <AuditLogDetailModal
          auditLog={selectedAudit}
          onClose={() => setSelectedAudit(null)}
        />
      )}
    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}
