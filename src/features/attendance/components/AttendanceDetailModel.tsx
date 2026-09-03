import {
  Clock,
  MapPin,
  UserRound,
  X,
} from 'lucide-react';

import type {
  Attendance,
} from '../types/attendance.types';

interface AttendanceDetailModalProps {
  attendance: Attendance;
  onClose: () => void;
}

export default function AttendanceDetailModal({
  attendance,
  onClose,
}: AttendanceDetailModalProps) {
  const employee =
    attendance.schedule.employee;

  const shift =
    attendance.schedule.shift;

  const office =
    attendance.schedule.office;

  const fullName = [
    employee.firstName,
    employee.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal-card attendance-detail-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Attendance Record
            </p>

            <h2>
              Attendance Details
            </h2>

            <p>
              Detailed clock and
              workplace information.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="attendance-detail-grid">
          <DetailCard
            icon={
              <UserRound size={18} />
            }
            label="Employee"
            value={fullName}
            secondary={
              employee.employeeNumber
            }
          />

          <DetailCard
            icon={
              <Clock size={18} />
            }
            label="Work Date"
            value={formatDate(
              attendance.schedule
                .workDate,
            )}
            secondary={shift.name}
          />

          <DetailCard
            icon={
              <MapPin size={18} />
            }
            label="Office"
            value={office.name}
            secondary={
              office.address ?? '-'
            }
          />
        </div>

        <div className="attendance-detail-section">
          <h3>
            Clock Information
          </h3>

          <div className="attendance-info-grid">
            <InfoItem
              label="Check In"
              value={formatDateTime(
                attendance.checkInAt,
              )}
            />

            <InfoItem
              label="Check Out"
              value={formatDateTime(
                attendance.checkOutAt,
              )}
            />

            <InfoItem
              label="Status"
              value={formatStatus(
                attendance.status,
              )}
            />

            <InfoItem
              label="Shift"
              value={`${formatTime(
                shift.startTime,
              )} - ${formatTime(
                shift.endTime,
              )}`}
            />
          </div>
        </div>

        <div className="attendance-detail-section">
          <h3>
            Location Validation
          </h3>

          <div className="attendance-info-grid">
            <InfoItem
              label="Check-in Location"
              value={formatCoordinate(
                attendance
                  .checkInLatitude,
                attendance
                  .checkInLongitude,
              )}
            />

            <InfoItem
              label="Check-out Location"
              value={formatCoordinate(
                attendance
                  .checkOutLatitude,
                attendance
                  .checkOutLongitude,
              )}
            />

            <InfoItem
              label="Check-in Distance"
              value={formatDistance(
                attendance
                  .checkInDistanceMeters,
              )}
            />

            <InfoItem
              label="Check-out Distance"
              value={formatDistance(
                attendance
                  .checkOutDistanceMeters,
              )}
            />

            <InfoItem
              label="Allowed Radius"
              value={`${office.allowedRadiusMeters} m`}
            />

            <InfoItem
              label="Schedule ID"
              value={
                attendance.scheduleId
              }
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="primary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary: string;
}) {
  return (
    <div className="attendance-detail-card">
      <div className="attendance-detail-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{secondary}</small>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="attendance-info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDate(
  value: string,
) {
  const date = new Date(value);

  return new Intl.DateTimeFormat(
    'en-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(date);
}

function formatDateTime(
  value: string | null,
) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  return new Intl.DateTimeFormat(
    'en-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date);
}

function formatTime(
  value: string,
) {
  const date = new Date(value);

  return new Intl.DateTimeFormat(
    'en-ID',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date);
}

function formatStatus(
  value: string,
) {
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatCoordinate(
  latitude: string | null,
  longitude: string | null,
) {
  if (
    latitude == null ||
    longitude == null
  ) {
    return '-';
  }

  return `${latitude}, ${longitude}`;
}

function formatDistance(
  value: string | null,
) {
  if (value == null) {
    return '-';
  }

  const distance =
    Number(value);

  if (
    Number.isNaN(distance)
  ) {
    return '-';
  }

  return `${distance.toFixed(2)} m`;
}