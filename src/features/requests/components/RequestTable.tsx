import {
  Eye,
} from 'lucide-react';

import type {
  EmployeeRequest,
} from '../types/request.types';

interface RequestTableProps {
  items: EmployeeRequest[];

  onView: (
    request: EmployeeRequest,
  ) => void;
}

export default function RequestTable({
  items,
  onView,
}: RequestTableProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          📄
        </div>

        <h3>
          No requests found
        </h3>

        <p>
          No employee requests match
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
            <th>Type</th>
            <th>Date Range</th>
            <th>Submitted</th>
            <th>Status</th>
            <th className="table-action-column">
              Details
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

                      <small>
                        {item.employee.email}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="request-type-badge">
                    {formatRequestType(
                      item.type,
                    )}
                  </span>
                </td>

                <td>
                  <div className="request-date-cell">
                    <strong>
                      {formatDate(
                        item.startDate,
                      )}
                    </strong>

                    <span>
                      to{' '}
                      {formatDate(
                        item.endDate,
                      )}
                    </span>
                  </div>
                </td>

                <td>
                  {formatDateTime(
                    item.submittedAt,
                  )}
                </td>

                <td>
                  <RequestStatusBadge
                    status={item.status}
                  />
                </td>

                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="table-action-button"
                      onClick={() =>
                        onView(item)
                      }
                      title="View request"
                    >
                      <Eye size={16} />
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

function RequestStatusBadge({
  status,
}: {
  status: string;
}) {
  const className =
    status === 'approved'
      ? 'request-status-approved'
      : status === 'rejected'
        ? 'request-status-rejected'
        : 'request-status-pending';

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
  switch (value) {
    case 'leave':
      return 'Leave';

    case 'permission':
      return 'Permission';

    case 'attendance_correction':
      return 'Attendance Correction';

    default:
      return value;
  }
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(
    new Date(value),
  );
}