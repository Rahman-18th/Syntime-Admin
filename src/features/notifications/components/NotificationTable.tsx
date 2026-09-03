import {
  Mail,
  MailOpen,
} from 'lucide-react';

import type {
  AdminNotification,
} from '../types/notification.types';

interface Props {
  items: AdminNotification[];
}

export default function NotificationTable({
  items,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          🔔
        </div>

        <h3>
          No notifications found
        </h3>

        <p>
          No notifications match the current filters.
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
            <th>Notification</th>
            <th>Type</th>
            <th>Status</th>
            <th>Created</th>
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
                      <strong>{fullName}</strong>

                      <span>
                        {item.employee.employeeNumber}
                      </span>

                      <small>
                        {item.employee.email}
                      </small>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="notification-message-cell">
                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      {item.message}
                    </span>
                  </div>
                </td>

                <td>
                  <span className="request-type-badge">
                    {formatType(item.type)}
                  </span>
                </td>

                <td>
                  <span
                    className={
                      item.isRead
                        ? 'status-badge notification-read'
                        : 'status-badge notification-unread'
                    }
                  >
                    {item.isRead ? (
                      <>
                        <MailOpen size={12} />
                        Read
                      </>
                    ) : (
                      <>
                        <Mail size={12} />
                        Unread
                      </>
                    )}
                  </span>
                </td>

                <td>
                  {formatDateTime(
                    item.createdAt,
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatType(
  value: string | null,
) {
  if (!value) {
    return 'General';
  }

  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
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
  ).format(new Date(value));
}