import {
  Eye,
} from 'lucide-react';

import type {
  Attendance,
} from '../types/attendance.types';

interface AttendanceTableProps {
  items: Attendance[];

  onView: (
    attendance: Attendance,
  ) => void;
}

export default function AttendanceTable({
  items,
  onView,
}: AttendanceTableProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          🕒
        </div>

        <h3>
          No attendance records
        </h3>

        <p>
          No records match the
          current filters.
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
            <th>Date</th>
            <th>Shift</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Status</th>
            <th className="table-action-column">
              Details
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const employee =
              item.schedule.employee;

            const fullName = [
              employee.firstName,
              employee.lastName,
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <tr key={item.id}>
                <td>
                  <div className="employee-cell">
                    <div className="employee-avatar">
                      {employee.firstName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="employee-copy">
                      <strong>
                        {fullName}
                      </strong>

                      <span>
                        {
                          employee.employeeNumber
                        }
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  {formatDate(
                    item.schedule
                      .workDate,
                  )}
                </td>

                <td>
                  <div className="attendance-shift-cell">
                    <strong>
                      {
                        item.schedule
                          .shift.name
                      }
                    </strong>

                    <span>
                      {formatTime(
                        item.schedule
                          .shift.startTime,
                      )}
                      {' - '}
                      {formatTime(
                        item.schedule
                          .shift.endTime,
                      )}
                    </span>
                  </div>
                </td>

                <td>
                  {formatClock(
                    item.checkInAt,
                  )}
                </td>

                <td>
                  {formatClock(
                    item.checkOutAt,
                  )}
                </td>

                <td>
                  <AttendanceBadge
                    status={
                      item.status
                    }
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
                      title="View attendance"
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

function AttendanceBadge({
  status,
}: {
  status: string;
}) {
  const className =
    status === 'present'
      ? 'attendance-status-present'
      : status === 'late'
        ? 'attendance-status-late'
        : 'attendance-status-default';

  return (
    <span
      className={`status-badge ${className}`}
    >
      {status.replaceAll('_', ' ')}
    </span>
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

function formatClock(
  value: string | null,
) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'en-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(
    new Date(value),
  );
}

function formatTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    'en-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(
    new Date(value),
  );
}