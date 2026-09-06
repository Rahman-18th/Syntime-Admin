import {
  X,
} from 'lucide-react';

import type {
  AuditLog,
} from '../types/audit-log.types';

interface AuditLogDetailModalProps {
  auditLog: AuditLog;
  onClose: () => void;
}

export default function AuditLogDetailModal({
  auditLog,
  onClose,
}: AuditLogDetailModalProps) {
  const employee = auditLog.actor?.employee;
  const actorName = employee
    ? [employee.firstName, employee.lastName].filter(Boolean).join(' ')
    : auditLog.actor?.email ?? 'System';

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">Security</p>
            <h2>Audit Log Details</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="audit-detail-grid">
          <AuditField label="Actor" value={actorName} />
          <AuditField label="Email" value={auditLog.actor?.email ?? 'System'} />
          <AuditField label="Action" value={auditLog.action} />
          <AuditField label="Entity" value={auditLog.entityType} />
          <AuditField label="Entity ID" value={auditLog.entityId ?? '-'} />
          <AuditField label="IP Address" value={auditLog.ipAddress ?? '-'} />
          <AuditField
            label="Created At"
            value={new Intl.DateTimeFormat('en-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).format(new Date(auditLog.createdAt))}
          />
          <AuditField label="User Agent" value={auditLog.userAgent ?? '-'} />
        </div>

        <div className="audit-description">
          <span>Description</span>
          <p>{auditLog.description}</p>
        </div>

        <div className="audit-metadata">
          <span>Metadata</span>
          <pre>
            {auditLog.metadata
              ? JSON.stringify(auditLog.metadata, null, 2)
              : 'No metadata'}
          </pre>
        </div>
      </div>
    </div>
  );
}

function AuditField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="audit-detail-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
