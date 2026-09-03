import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import type {
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
  WorkType,
} from '../types/employee.types';

interface EmployeeFormModalProps {
  employee?: Employee | null;

  isSubmitting: boolean;

  onClose: () => void;

  onSubmit: (
    payload:
      | CreateEmployeePayload
      | UpdateEmployeePayload,
  ) => Promise<void>;
}

interface FormState {
  companyId: string;
  departmentId: string;
  officeId: string;

  employeeNumber: string;

  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  position: string;
  workType: WorkType | '';

  joinDate: string;
}

export default function EmployeeFormModal({
  employee,
  isSubmitting,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const editing =
    employee != null;

  const [form, setForm] =
    useState<FormState>(() => ({
      companyId:
        employee?.companyId ?? '1',

      departmentId:
        employee?.departmentId ?? '1',

      officeId:
        employee?.officeId ?? '1',

      employeeNumber:
        employee?.employeeNumber ?? '',

      firstName:
        employee?.firstName ?? '',

      lastName:
        employee?.lastName ?? '',

      email:
        employee?.email ?? '',

      phone:
        employee?.phone ?? '',

      position:
        employee?.position ?? '',

      workType:
        employee?.workType ?? '',

      joinDate:
        employee?.joinDate
          ? employee.joinDate
              .slice(0, 10)
          : '',
    }));

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (editing) {
      const payload:
        UpdateEmployeePayload = {
          departmentId:
            form.departmentId,

          officeId:
            form.officeId,

          firstName:
            form.firstName.trim(),

          lastName:
            form.lastName.trim(),

          email:
            form.email.trim(),

          phone:
            form.phone.trim(),

          position:
            form.position.trim(),

          ...(form.workType && {
            workType:
              form.workType,
          }),

          ...(form.joinDate && {
            joinDate:
              form.joinDate,
          }),
        };

      await onSubmit(payload);

      return;
    }

    const payload:
      CreateEmployeePayload = {
        companyId:
          form.companyId,

        departmentId:
          form.departmentId,

        officeId:
          form.officeId,

        employeeNumber:
          form.employeeNumber.trim(),

        firstName:
          form.firstName.trim(),

        email:
          form.email.trim(),

        ...(form.lastName.trim() && {
          lastName:
            form.lastName.trim(),
        }),

        ...(form.phone.trim() && {
          phone:
            form.phone.trim(),
        }),

        ...(form.position.trim() && {
          position:
            form.position.trim(),
        }),

        ...(form.workType && {
          workType:
            form.workType,
        }),

        ...(form.joinDate && {
          joinDate:
            form.joinDate,
        }),
      };

    await onSubmit(payload);
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal-card employee-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Workforce
            </p>

            <h2>
              {editing
                ? 'Edit Employee'
                : 'New Employee'}
            </h2>

            <p>
              Manage employee identity
              and work assignment.
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

        <form
          className="form-stack"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <label className="form-field">
              <span>
                Employee Number
              </span>

              <input
                value={
                  form.employeeNumber
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      employeeNumber:
                        event.target
                          .value,
                    }),
                  )
                }
                disabled={editing}
                required={!editing}
              />
            </label>

            <label className="form-field">
              <span>Company ID</span>

              <input
                value={form.companyId}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      companyId:
                        event.target
                          .value,
                    }),
                  )
                }
                disabled={editing}
                required={!editing}
              />
            </label>
          </div>

          <div className="form-grid">
            <label className="form-field">
              <span>First Name</span>

              <input
                value={form.firstName}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      firstName:
                        event.target
                          .value,
                    }),
                  )
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Last Name</span>

              <input
                value={form.lastName}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      lastName:
                        event.target
                          .value,
                    }),
                  )
                }
              />
            </label>
          </div>

          <div className="form-grid">
            <label className="form-field">
              <span>Email</span>

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      email:
                        event.target
                          .value,
                    }),
                  )
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Phone</span>

              <input
                value={form.phone}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      phone:
                        event.target
                          .value,
                    }),
                  )
                }
              />
            </label>
          </div>

          <div className="form-grid">
            <label className="form-field">
              <span>
                Department ID
              </span>

              <input
                value={
                  form.departmentId
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      departmentId:
                        event.target
                          .value,
                    }),
                  )
                }
                required
              />
            </label>

            <label className="form-field">
              <span>Office ID</span>

              <input
                value={form.officeId}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      officeId:
                        event.target
                          .value,
                    }),
                  )
                }
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <label className="form-field">
              <span>Position</span>

              <input
                value={form.position}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      position:
                        event.target
                          .value,
                    }),
                  )
                }
              />
            </label>

            <label className="form-field">
              <span>Work Type</span>

              <select
                value={form.workType}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      workType:
                        event.target
                          .value as
                          | WorkType
                          | '',
                    }),
                  )
                }
              >
                <option value="">
                  Select work type
                </option>

                <option value="full_time">
                  Full Time
                </option>

                <option value="part_time">
                  Part Time
                </option>

                <option value="contract">
                  Contract
                </option>

                <option value="internship">
                  Internship
                </option>
              </select>
            </label>
          </div>

          <label className="form-field">
            <span>Join Date</span>

            <input
              type="date"
              value={form.joinDate}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    joinDate:
                      event.target.value,
                  }),
                )
              }
            />
          </label>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
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
                : editing
                  ? 'Save Changes'
                  : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}