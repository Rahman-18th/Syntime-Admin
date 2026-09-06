import {
  Eye,
} from 'lucide-react';

import type {
  AuditLog,
} from '../types/audit-log.types';

interface AuditLogTableProps {
  items: AuditLog[];
  onView: (item: AuditLog) => void;
}

export default function AuditLogTable({
  items,
  onView,
}: AuditLogTableProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          {'\u{1F4DC}'}
        </div>
        <h3>No audit logs found</h3>
        <p>No activity matches the current filters.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Actor</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Description</th>
            <th>Time</th>
            <th className="table-action-column">Details</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const actorName = getActorName(item);

            return (
              <tr key={item.id}>
                <td>
                  <div className="employee-copy">
                    <strong>{actorName}</strong>
                    <small>{item.actor?.email ?? 'System'}</small>
                  </div>
                </td>
                <td>
                  <span className="status-badge audit-action-badge">
                    {formatAction(item.action)}
                  </span>
                </td>
                <td>
                  <div className="attendance-shift-cell">
                    <strong>{formatEntity(item.entityType)}</strong>
                    <span>{item.entityId ? `#${item.entityId}` : '-'}</span>
                  </div>
                </td>
                <td>{item.description}</td>
                <td>{formatDateTime(item.createdAt)}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="table-action-button"
                      title="View audit log"
                      onClick={() => onView(item)}
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

function getActorName(item: AuditLog) {
  const employee = item.actor?.employee;

  if (!employee) {
    return item.actor?.email ?? 'System';
  }

  return [employee.firstName, employee.lastName]
    .filter(Boolean)
    .join(' ');
}

function formatAction(value: string) {
  return value
    .split('.')
    .map((part) =>
      part.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
    )
    .join(' · ');
}

function formatEntity(value: string) {
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
