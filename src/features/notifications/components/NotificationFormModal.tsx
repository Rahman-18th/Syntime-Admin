import {
  useState,
} from 'react';

import {
  BellRing,
  X,
} from 'lucide-react';

import type {
  Employee,
} from '../../employees/types/employee.types';

import type {
  CreateNotificationPayload,
} from '../types/notification.types';

interface Props {
  employees: Employee[];
  isSubmitting: boolean;

  onClose: () => void;

  onSubmit: (
    payload: CreateNotificationPayload,
  ) => Promise<void>;
}

export default function NotificationFormModal({
  employees,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const [
    employeeId,
    setEmployeeId,
  ] =
    useState('');

  const [title, setTitle] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [type, setType] =
    useState('manual');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit({
      employeeId,
      title: title.trim(),
      message: message.trim(),
      type,
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal-card notification-form-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Communication
            </p>

            <h2>
              Send Notification
            </h2>

            <p>
              Send a direct notification
              to an employee.
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

        <div className="notification-modal-icon">
          <BellRing size={26} />
        </div>

        <form
          className="form-stack"
          onSubmit={handleSubmit}
        >
          <label className="form-field">
            <span>Employee</span>

            <select
              value={employeeId}
              onChange={(event) =>
                setEmployeeId(
                  event.target.value,
                )
              }
              required
            >
              <option value="">
                Select employee
              </option>

              {employees.map(
                (employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.employeeNumber}
                    {' - '}
                    {employee.firstName}
                    {employee.lastName
                      ? ` ${employee.lastName}`
                      : ''}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="form-field">
            <span>Title</span>

            <input
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              placeholder="e.g. Schedule Reminder"
              required
            />
          </label>

          <label className="form-field">
            <span>Type</span>

            <select
              value={type}
              onChange={(event) =>
                setType(
                  event.target.value,
                )
              }
            >
              <option value="manual">
                Manual
              </option>

              <option value="schedule">
                Schedule
              </option>

              <option value="information">
                Information
              </option>

              <option value="warning">
                Warning
              </option>

              <option value="payroll">
                Payroll
              </option>
            </select>
          </label>

          <label className="form-field">
            <span>Message</span>

            <textarea
              rows={5}
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value,
                )
              }
              placeholder="Write notification message..."
              required
            />
          </label>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Sending...'
                : 'Send Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}