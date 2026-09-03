import {
  Check,
  ExternalLink,
  FileText,
  UserRound,
  X,
  XCircle,
} from 'lucide-react';

import {
  useState,
} from 'react';

import type {
  EmployeeRequest,
  ReviewRequestPayload,
} from '../types/request.types';

interface RequestDetailModalProps {
  request: EmployeeRequest;
  isSubmitting: boolean;

  onClose: () => void;

  onReview: (
    payload: ReviewRequestPayload,
  ) => Promise<void>;
}

export default function RequestDetailModal({
  request,
  isSubmitting,
  onClose,
  onReview,
}: RequestDetailModalProps) {
  const [reviewNote, setReviewNote] =
    useState(
      request.reviewNote ?? '',
    );

  const pending =
    request.status === 'pending';

  const fullName = [
    request.employee.firstName,
    request.employee.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  async function handleApprove() {
    await onReview({
      status: 'approved',
      ...(reviewNote.trim() && {
        reviewNote:
          reviewNote.trim(),
      }),
    });
  }

  async function handleReject() {
    await onReview({
      status: 'rejected',
      ...(reviewNote.trim() && {
        reviewNote:
          reviewNote.trim(),
      }),
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal-card request-detail-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Employee Request
            </p>

            <h2>
              Request Details
            </h2>

            <p>
              Review employee request
              information and supporting files.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        <div className="request-detail-grid">
          <DetailCard
            icon={<UserRound size={18} />}
            label="Employee"
            value={fullName}
            secondary={
              request.employee.employeeNumber
            }
          />

          <DetailCard
            icon={<FileText size={18} />}
            label="Request Type"
            value={formatRequestType(
              request.type,
            )}
            secondary={
              `#${request.id}`
            }
          />

          <div className="request-detail-card">
            <div>
              <span>Status</span>

              <strong>
                <RequestStatusBadge
                  status={
                    request.status
                  }
                />
              </strong>

              <small>
                {request.reviewedAt
                  ? formatDateTime(
                      request.reviewedAt,
                    )
                  : 'Awaiting review'}
              </small>
            </div>
          </div>
        </div>

        <section className="request-detail-section">
          <h3>
            Request Information
          </h3>

          <div className="attendance-info-grid">
            <InfoItem
              label="Start Date"
              value={formatDate(
                request.startDate,
              )}
            />

            <InfoItem
              label="End Date"
              value={formatDate(
                request.endDate,
              )}
            />

            <InfoItem
              label="Submitted At"
              value={formatDateTime(
                request.submittedAt,
              )}
            />

            <InfoItem
              label="Reviewer"
              value={
                request.reviewer?.email ??
                '-'
              }
            />
          </div>
        </section>

        <section className="request-detail-section">
          <h3>
            Reason
          </h3>

          <div className="request-reason-box">
            {request.reason}
          </div>
        </section>

        <section className="request-detail-section">
          <h3>
            Attachments
          </h3>

          {request.attachments.length === 0 ? (
            <div className="request-empty-attachment">
              No attachments submitted.
            </div>
          ) : (
            <div className="request-attachment-list">
              {request.attachments.map(
                (attachment) => (
                  <a
                    key={attachment.id}
                    className="request-attachment-item"
                    href={buildAttachmentUrl(
                      attachment.fileUrl,
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileText size={17} />

                    <div>
                      <strong>
                        {
                          attachment.fileName
                        }
                      </strong>

                      <span>
                        {formatFileSize(
                          attachment.fileSize,
                        )}
                      </span>
                    </div>

                    <ExternalLink
                      size={15}
                    />
                  </a>
                ),
              )}
            </div>
          )}
        </section>

        <section className="request-detail-section">
          <h3>
            Review Note
          </h3>

          <textarea
            className="request-review-note"
            rows={4}
            value={reviewNote}
            onChange={(event) =>
              setReviewNote(
                event.target.value,
              )
            }
            placeholder={
              pending
                ? 'Add optional review note...'
                : 'No review note'
            }
            disabled={!pending}
          />
        </section>

        <div className="modal-footer">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Close
          </button>

          {pending && (
            <>
              <button
                type="button"
                className="request-reject-button"
                onClick={
                  handleReject
                }
                disabled={isSubmitting}
              >
                <XCircle size={16} />
                Reject
              </button>

              <button
                type="button"
                className="primary-button button-with-icon"
                onClick={
                  handleApprove
                }
                disabled={isSubmitting}
              >
                <Check size={16} />

                {isSubmitting
                  ? 'Saving...'
                  : 'Approve'}
              </button>
            </>
          )}
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
    <div className="request-detail-card">
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
  return value
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
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
  ).format(new Date(value));
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

function formatFileSize(
  value: string | null,
) {
  if (!value) {
    return 'Unknown size';
  }

  const bytes =
    Number(value);

  if (
    Number.isNaN(bytes)
  ) {
    return 'Unknown size';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function buildAttachmentUrl(
  value: string,
) {
  if (
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value;
  }

  return `http://localhost:5000${value}`;
}