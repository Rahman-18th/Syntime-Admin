import {
  Pencil,
  Trash2,
} from 'lucide-react';

import type {
  Announcement,
} from '../types/announcement.types';

interface AnnouncementTableProps {
  items: Announcement[];
  onEdit: (
    announcement: Announcement,
  ) => void;
  onDelete: (
    announcement: Announcement,
  ) => void;
}

export default function AnnouncementTable({
  items,
  onEdit,
  onDelete,
}: AnnouncementTableProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          📢
        </div>

        <h3>
          No announcements yet
        </h3>

        <p>
          Create your first announcement
          to communicate with employees.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Announcement</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th className="table-action-column">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="announcement-cell">
                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.message}
                  </span>
                </div>
              </td>

              <td>
                <span
                  className={`status-badge priority-${item.priority}`}
                >
                  {item.priority}
                </span>
              </td>

              <td>
                <span
                  className={
                    item.isPublished
                      ? 'status-badge status-published'
                      : 'status-badge status-draft'
                  }
                >
                  {item.isPublished
                    ? 'Published'
                    : 'Draft'}
                </span>
              </td>

              <td>
                {formatDate(
                  item.createdAt,
                )}
              </td>

              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="table-action-button"
                    onClick={() =>
                      onEdit(item)
                    }
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    className="table-action-button table-delete-button"
                    onClick={() =>
                      onDelete(item)
                    }
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(
  value: string,
) {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'en-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(date);
}