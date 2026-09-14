import {
  useState,
} from 'react';

import type {
  Company,
  Shift,
  ShiftPayload,
} from '../types/master-data.types';

interface ShiftFormModalProps {
  shift: Shift | null;
  companies: Company[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    payload: ShiftPayload,
  ) => void;
}

export default function ShiftFormModal({
  shift,
  companies,
  isSubmitting,
  onClose,
  onSubmit,
}: ShiftFormModalProps) {
  const [
    companyId,
    setCompanyId,
  ] = useState(
    shift?.companyId ??
      companies[0]?.id ??
      '',
  );

  const [
    name,
    setName,
  ] = useState(
    shift?.name ?? '',
  );

  const [
    startTime,
    setStartTime,
  ] = useState(
    shift
      ? formatShiftTime(
          shift.startTime,
        )
      : '',
  );

  const [
    endTime,
    setEndTime,
  ] = useState(
    shift
      ? formatShiftTime(
          shift.endTime,
        )
      : '',
  );

  const [
    breakStart,
    setBreakStart,
  ] = useState(
    shift?.breakStart
      ? formatShiftTime(
          shift.breakStart,
        )
      : '',
  );

  const [
    breakEnd,
    setBreakEnd,
  ] = useState(
    shift?.breakEnd
      ? formatShiftTime(
          shift.breakEnd,
        )
      : '',
  );

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (
      !companyId ||
      !name.trim() ||
      !startTime ||
      !endTime
    ) {
      return;
    }

    onSubmit({
      companyId,
      name:
        name.trim(),
      startTime,
      endTime,

      ...(breakStart && {
        breakStart,
      }),

      ...(breakEnd && {
        breakEnd,
      }),
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Master Data
            </p>

            <h2>
              {shift
                ? 'Edit Shift'
                : 'New Shift'}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="modal-form"
          onSubmit={handleSubmit}
        >
          <div className="form-field">
            <label htmlFor="shift-company">
              Company
            </label>

            <select
              id="shift-company"
              value={companyId}
              onChange={(event) =>
                setCompanyId(
                  event.target.value,
                )
              }
              disabled={
                Boolean(shift)
              }
              required
            >
              <option value="">
                Select company
              </option>

              {companies.map(
                (company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="shift-name">
              Shift Name
            </label>

            <input
              id="shift-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="Regular Shift"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="shift-start">
                Start Time
              </label>

              <input
                id="shift-start"
                type="time"
                value={startTime}
                onChange={(event) =>
                  setStartTime(
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="shift-end">
                End Time
              </label>

              <input
                id="shift-end"
                type="time"
                value={endTime}
                onChange={(event) =>
                  setEndTime(
                    event.target.value,
                  )
                }
                required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="break-start">
                Break Start
              </label>

              <input
                id="break-start"
                type="time"
                value={breakStart}
                onChange={(event) =>
                  setBreakStart(
                    event.target.value,
                  )
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="break-end">
                Break End
              </label>

              <input
                id="break-end"
                type="time"
                value={breakEnd}
                onChange={(event) =>
                  setBreakEnd(
                    event.target.value,
                  )
                }
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : shift
                  ? 'Update Shift'
                  : 'Create Shift'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatShiftTime(
  value: string,
) {
  const date =
    new Date(value);

  const hours =
    date
      .getUTCHours()
      .toString()
      .padStart(2, '0');

  const minutes =
    date
      .getUTCMinutes()
      .toString()
      .padStart(2, '0');

  return `${hours}:${minutes}`;
}