import {
  useMemo,
  useState,
} from 'react';

import type {
  Employee,
} from '../../employees/types/employee.types';

import type {
  Office,
  Shift,
} from '../../master-data/types/master-data.types';

import type {
  Schedule,
  SchedulePayload,
  ScheduleStatus,
} from '../types/schedule.types';

interface ScheduleFormModalProps {
  schedule: Schedule | null;

  employees: Employee[];
  shifts: Shift[];
  offices: Office[];

  isSubmitting: boolean;

  onClose: () => void;

  onSubmit: (
    payload: SchedulePayload,
  ) => void;
}

export default function ScheduleFormModal({
  schedule,
  employees,
  shifts,
  offices,
  isSubmitting,
  onClose,
  onSubmit,
}: ScheduleFormModalProps) {
  const initialEmployee =
    schedule
      ? employees.find(
          (employee) =>
            employee.id ===
            schedule.employeeId,
        ) ?? null
      : employees.find(
          (employee) =>
            employee.status ===
            'active',
        ) ?? null;

  const initialShift =
    schedule
      ? shifts.find(
          (shift) =>
            shift.id ===
            schedule.shiftId,
        ) ?? null
      : shifts.find(
          (shift) =>
            shift.companyId ===
            initialEmployee?.companyId,
        ) ?? null;

  const initialOffice =
    schedule
      ? offices.find(
          (office) =>
            office.id ===
            schedule.officeId,
        ) ?? null
      : offices.find(
          (office) =>
            office.id ===
              initialEmployee?.officeId &&
            office.companyId ===
              initialEmployee?.companyId,
        ) ??
        offices.find(
          (office) =>
            office.companyId ===
            initialEmployee?.companyId,
        ) ??
        null;

  const [
    employeeId,
    setEmployeeId,
  ] = useState(
    schedule?.employeeId ??
      initialEmployee?.id ??
      '',
  );

  const [
    shiftId,
    setShiftId,
  ] = useState(
    schedule?.shiftId ??
      initialShift?.id ??
      '',
  );

  const [
    officeId,
    setOfficeId,
  ] = useState(
    schedule?.officeId ??
      initialOffice?.id ??
      '',
  );

  const [
    workDate,
    setWorkDate,
  ] = useState(
    schedule
      ? schedule.workDate.slice(
          0,
          10,
        )
      : '',
  );

  const [
    status,
    setStatus,
  ] =
    useState<ScheduleStatus>(
      schedule?.status ??
        'scheduled',
    );

  const selectedEmployee =
    useMemo(
      () =>
        employees.find(
          (employee) =>
            employee.id ===
            employeeId,
        ) ?? null,
      [
        employeeId,
        employees,
      ],
    );

  const availableShifts =
    useMemo(() => {
      if (!selectedEmployee) {
        return [];
      }

      return shifts.filter(
        (shift) =>
          shift.companyId ===
          selectedEmployee.companyId,
      );
    }, [
      selectedEmployee,
      shifts,
    ]);

  const availableOffices =
    useMemo(() => {
      if (!selectedEmployee) {
        return [];
      }

      return offices.filter(
        (office) =>
          office.companyId ===
          selectedEmployee.companyId,
      );
    }, [
      selectedEmployee,
      offices,
    ]);

  function handleEmployeeChange(
    value: string,
  ) {
    setEmployeeId(value);

    const employee =
      employees.find(
        (item) =>
          item.id === value,
      );

    if (!employee) {
      setShiftId('');
      setOfficeId('');

      return;
    }

    const firstShift =
      shifts.find(
        (shift) =>
          shift.companyId ===
          employee.companyId,
      );

    setShiftId(
      firstShift?.id ?? '',
    );

    const employeeOffice =
      offices.find(
        (office) =>
          office.id ===
            employee.officeId &&
          office.companyId ===
            employee.companyId,
      );

    const firstOffice =
      employeeOffice ??
      offices.find(
        (office) =>
          office.companyId ===
          employee.companyId,
      );

    setOfficeId(
      firstOffice?.id ?? '',
    );
  }

  function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (
      !employeeId ||
      !shiftId ||
      !officeId ||
      !workDate
    ) {
      return;
    }

    onSubmit({
      employeeId,
      shiftId,
      officeId,
      workDate,
      status,
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Workforce
            </p>

            <h2>
              {schedule
                ? 'Edit Schedule'
                : 'New Schedule'}
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
            <label htmlFor="schedule-employee">
              Employee
            </label>

            <select
              id="schedule-employee"
              value={employeeId}
              onChange={(event) =>
                handleEmployeeChange(
                  event.target.value,
                )
              }
              required
            >
              <option value="">
                Select employee
              </option>

              {employees
                .filter(
                  (employee) =>
                    employee.status ===
                      'active' ||
                    employee.id ===
                      schedule?.employeeId,
                )
                .map(
                  (employee) => (
                    <option
                      key={
                        employee.id
                      }
                      value={
                        employee.id
                      }
                    >
                      {
                        employee.employeeNumber
                      }
                      {' - '}
                      {
                        employee.firstName
                      }
                      {employee.lastName
                        ? ` ${employee.lastName}`
                        : ''}
                    </option>
                  ),
                )}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="schedule-shift">
              Shift
            </label>

            <select
              id="schedule-shift"
              value={shiftId}
              onChange={(event) =>
                setShiftId(
                  event.target.value,
                )
              }
              required
            >
              <option value="">
                Select shift
              </option>

              {availableShifts.map(
                (shift) => (
                  <option
                    key={shift.id}
                    value={shift.id}
                  >
                    {shift.name}
                    {' ('}
                    {formatShiftTime(
                      shift.startTime,
                    )}
                    {' - '}
                    {formatShiftTime(
                      shift.endTime,
                    )}
                    {')'}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="schedule-office">
              Office
            </label>

            <select
              id="schedule-office"
              value={officeId}
              onChange={(event) =>
                setOfficeId(
                  event.target.value,
                )
              }
              required
            >
              <option value="">
                Select office
              </option>

              {availableOffices.map(
                (office) => (
                  <option
                    key={office.id}
                    value={office.id}
                  >
                    {office.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="schedule-date">
                Work Date
              </label>

              <input
                id="schedule-date"
                type="date"
                value={workDate}
                onChange={(event) =>
                  setWorkDate(
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="schedule-status">
                Status
              </label>

              <select
                id="schedule-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as ScheduleStatus,
                  )
                }
              >
                <option value="scheduled">
                  Scheduled
                </option>

                <option value="off">
                  Off
                </option>

                <option value="holiday">
                  Holiday
                </option>
              </select>
            </div>
          </div>

          {selectedEmployee && (
            <div className="info-banner">
              <span>
                Company:{' '}
                {
                  selectedEmployee
                    .company.name
                }
              </span>
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={onClose}
              disabled={
                isSubmitting
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={
                isSubmitting ||
                !employeeId ||
                !shiftId ||
                !officeId ||
                !workDate
              }
            >
              {isSubmitting
                ? 'Saving...'
                : schedule
                  ? 'Update Schedule'
                  : 'Create Schedule'}
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