import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';

import {
  CalendarDays,
  Pencil,
  Plus,
  RefreshCw,
} from 'lucide-react';

import {
  createSchedule,
  getSchedules,
  updateSchedule,
} from '../api/schedule.api';

import {
  getEmployees,
} from '../../employees/api/employee.api';

import {
  getOffices,
  getShifts,
} from '../../master-data/api/master-data.api';

import ScheduleFormModal
  from '../components/ScheduleFormModal';

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
} from '../types/schedule.types';

import {
  useToast,
} from '../../../components/toast/useToast';

export default function SchedulePage() {
    const { showToast } =
  useToast();
  const [
    schedules,
    setSchedules,
  ] = useState<Schedule[]>([]);

  const [
    employees,
    setEmployees,
  ] = useState<Employee[]>([]);

  const [
    shifts,
    setShifts,
  ] = useState<Shift[]>([]);

  const [
    offices,
    setOffices,
  ] = useState<Office[]>([]);

  const [
    selectedSchedule,
    setSelectedSchedule,
  ] =
    useState<Schedule | null>(
      null,
    );

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const loadData =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [
          scheduleData,
          employeeData,
          shiftData,
          officeData,
        ] = await Promise.all([
          getSchedules(),
          getEmployees(),
          getShifts(),
          getOffices(),
        ]);

        setSchedules(
          scheduleData,
        );

        setEmployees(
          employeeData,
        );

        setShifts(
          shiftData,
        );

        setOffices(
          officeData,
        );
      } catch (error) {
        setError(
          getErrorMessage(
            error,
            'Failed to load schedules.',
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        void loadData();
      }, 0);

    return () =>
      window.clearTimeout(
        timeoutId,
      );
  }, [loadData]);

  const summary =
    useMemo(() => {
      return {
        total:
          schedules.length,

        scheduled:
          schedules.filter(
            (item) =>
              item.status ===
              'scheduled',
          ).length,

        off:
          schedules.filter(
            (item) =>
              item.status ===
              'off',
          ).length,

        holiday:
          schedules.filter(
            (item) =>
              item.status ===
              'holiday',
          ).length,
      };
    }, [schedules]);

  function openCreate() {
    setSelectedSchedule(
      null,
    );

    setModalOpen(true);
  }

  function openEdit(
    schedule: Schedule,
  ) {
    setSelectedSchedule(
      schedule,
    );

    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);

    setSelectedSchedule(
      null,
    );
  }

  async function saveSchedule(
    payload: SchedulePayload,
  ) {
    setIsSubmitting(true);

    try {
      const isEditing =
        Boolean(
          selectedSchedule,
        );

      if (selectedSchedule) {
        await updateSchedule(
          selectedSchedule.id,
          payload,
        );
      } else {
        await createSchedule(
          payload,
        );
      }

      closeModal();

      await loadData();

      showToast({
        type: 'success',
        title: isEditing
          ? 'Schedule updated'
          : 'Schedule created',
        message: isEditing
          ? 'Schedule information was updated successfully.'
          : 'New schedule was created successfully.',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Schedule save failed',
        message: getErrorMessage(
          error,
          'Failed to save schedule.',
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="page-eyebrow">
            Workforce
          </p>

          <h1>
            Schedule Management
          </h1>

          <p>
            Assign employee work
            dates, shifts, and office
            locations.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            type="button"
            className="ghost-button button-with-icon"
            onClick={() =>
              void loadData()
            }
            disabled={
              isLoading
            }
          >
            <RefreshCw
              size={15}
              className={
                isLoading
                  ? 'spin'
                  : ''
              }
            />

            Refresh
          </button>

          <button
            type="button"
            className="primary-button button-with-icon"
            onClick={
              openCreate
            }
          >
            <Plus size={16} />

            New Schedule
          </button>
        </div>
      </section>

      <section className="master-data-stats">
        <ScheduleStat
          label="Total"
          value={
            summary.total
          }
        />

        <ScheduleStat
          label="Scheduled"
          value={
            summary.scheduled
          }
        />

        <ScheduleStat
          label="Off"
          value={
            summary.off
          }
        />

        <ScheduleStat
          label="Holiday"
          value={
            summary.holiday
          }
        />
      </section>

      {error && (
        <div className="error-banner">
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
          >
            ×
          </button>
        </div>
      )}

      <section className="panel-card">
        <div className="panel-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner" />

              <p>
                Loading schedules...
              </p>
            </div>
          ) : (
            <ScheduleTable
              items={
                schedules
              }
              onEdit={
                openEdit
              }
            />
          )}
        </div>
      </section>

      {modalOpen && (
        <ScheduleFormModal
          key={
            selectedSchedule
              ? selectedSchedule.id
              : 'new-schedule'
          }
          schedule={
            selectedSchedule
          }
          employees={
            employees
          }
          shifts={
            shifts
          }
          offices={
            offices
          }
          isSubmitting={
            isSubmitting
          }
          onClose={
            closeModal
          }
          onSubmit={
            saveSchedule
          }
        />
      )}
    </div>
  );
}

function ScheduleTable({
  items,
  onEdit,
}: {
  items: Schedule[];
  onEdit: (
    schedule: Schedule,
  ) => void;
}) {
  if (
    items.length === 0
  ) {
    return (
      <div className="loading-state">
        <CalendarDays
          size={28}
        />

        <p>
          No schedules found.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Shift</th>
            <th>Office</th>
            <th>Status</th>
            <th>Attendance</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map(
            (item) => (
              <tr
                key={
                  item.id
                }
              >
                <td>
                  {formatDate(
                    item.workDate,
                  )}
                </td>

                <td>
                  <strong>
                    {
                      item.employee
                        .employeeNumber
                    }
                  </strong>

                  <div>
                    {
                      item.employee
                        .firstName
                    }

                    {item.employee
                      .lastName
                      ? ` ${item.employee.lastName}`
                      : ''}
                  </div>
                </td>

                <td>
                  <strong>
                    {
                      item.shift
                        .name
                    }
                  </strong>

                  <div>
                    {formatShiftTime(
                      item.shift
                        .startTime,
                    )}
                    {' - '}
                    {formatShiftTime(
                      item.shift
                        .endTime,
                    )}
                  </div>
                </td>

                <td>
                  {
                    item.office
                      .name
                  }
                </td>

                <td>
                  {formatStatus(
                    item.status,
                  )}
                </td>

                <td>
                  {item.attendance
                    ? formatStatus(
                        item
                          .attendance
                          .status,
                      )
                    : '-'}
                </td>

                <td>
                  <button
                    type="button"
                    className="table-action-button"
                    onClick={() =>
                      onEdit(
                        item,
                      )
                    }
                  >
                    <Pencil
                      size={15}
                    />
                  </button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

function ScheduleStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="mini-stat">
      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}
        </strong>
      </div>

      <div className="mini-stat-icon">
        <CalendarDays
          size={18}
        />
      </div>
    </article>
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

function formatDate(
  value: string,
) {
  const date =
    new Date(value);

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    },
  ).format(date);
}

function formatStatus(
  value: string,
) {
  return value
    .replaceAll(
      '_',
      ' ',
    )
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    axios.isAxiosError(
      error,
    )
  ) {
    return (
      error.response
        ?.data
        ?.message ??
      fallback
    );
  }

  return fallback;
}