import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import {
  LoaderCircle,
  X,
} from 'lucide-react';

import {
  getCompanies,
  getDepartments,
  getOffices,
} from '../api/master-data.api';

import type {
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
  WorkType,
} from '../types/employee.types';

import type {
  CompanyOption,
  DepartmentOption,
  OfficeOption,
} from '../types/master-data.types';

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
        employee?.companyId ?? '',

      departmentId:
        employee?.departmentId ?? '',

      officeId:
        employee?.officeId ?? '',

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
          ? employee.joinDate.slice(
              0,
              10,
            )
          : '',
    }));

  const [
    companies,
    setCompanies,
  ] =
    useState<CompanyOption[]>([]);

  const [
    departments,
    setDepartments,
  ] =
    useState<DepartmentOption[]>([]);

  const [
    offices,
    setOffices,
  ] =
    useState<OfficeOption[]>([]);

  const [
    isLoadingMasterData,
    setIsLoadingMasterData,
  ] =
    useState(true);

  const [
    masterDataError,
    setMasterDataError,
  ] =
    useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Initial Master Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
  const initialCompanyId =
    employee?.companyId ?? '';

  async function loadInitialData() {
    setIsLoadingMasterData(true);
    setMasterDataError(null);

    try {
      const companyData =
        await getCompanies();

      setCompanies(companyData);

      if (initialCompanyId) {
        const [
          departmentData,
          officeData,
        ] =
          await Promise.all([
            getDepartments(
              initialCompanyId,
            ),

            getOffices(
              initialCompanyId,
            ),
          ]);

        setDepartments(
          departmentData,
        );

        setOffices(
          officeData,
        );
      }
    } catch (error) {
      setMasterDataError(
        getErrorMessage(
          error,
          'Failed to load company, department, and office data.',
        ),
      );
    } finally {
      setIsLoadingMasterData(
        false,
      );
    }
  }

  void loadInitialData();
}, [employee?.companyId]);
  /*
  |--------------------------------------------------------------------------
  | Company Change
  |--------------------------------------------------------------------------
  */

  async function handleCompanyChange(
    companyId: string,
  ) {
    setForm(
      (current) => ({
        ...current,

        companyId,

        departmentId: '',
        officeId: '',
      }),
    );

    setDepartments([]);
    setOffices([]);

    if (!companyId) {
      return;
    }

    setIsLoadingMasterData(true);
    setMasterDataError(null);

    try {
      const [
        departmentData,
        officeData,
      ] =
        await Promise.all([
          getDepartments(companyId),
          getOffices(companyId),
        ]);

      setDepartments(
        departmentData,
      );

      setOffices(
        officeData,
      );
    } catch (error) {
      setMasterDataError(
        getErrorMessage(
          error,
          'Failed to load departments and offices.',
        ),
      );
    } finally {
      setIsLoadingMasterData(
        false,
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !form.companyId ||
      !form.departmentId ||
      !form.officeId
    ) {
      setMasterDataError(
        'Company, department, and office are required.',
      );

      return;
    }

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
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        </div>

        {masterDataError && (
          <div className="error-banner">
            <span>
              {masterDataError}
            </span>

            <button
              type="button"
              onClick={() =>
                setMasterDataError(
                  null,
                )
              }
            >
              ×
            </button>
          </div>
        )}

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
              <span>Company</span>

              <select
                value={form.companyId}
                onChange={(event) =>
                  void handleCompanyChange(
                    event.target.value,
                  )
                }
                disabled={
                  editing ||
                  isLoadingMasterData
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
                Department
              </span>

              <select
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
                disabled={
                  !form.companyId ||
                  isLoadingMasterData
                }
                required
              >
                <option value="">
                  Select department
                </option>

                {departments.map(
                  (department) => (
                    <option
                      key={
                        department.id
                      }
                      value={
                        department.id
                      }
                    >
                      {
                        department.name
                      }
                    </option>
                  ),
                )}
              </select>
            </label>

            <label className="form-field">
              <span>Office</span>

              <select
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
                disabled={
                  !form.companyId ||
                  isLoadingMasterData
                }
                required
              >
                <option value="">
                  Select office
                </option>

                {offices.map(
                  (office) => (
                    <option
                      key={office.id}
                      value={office.id}
                    >
                      {office.name}
                      {office.address
                        ? ` - ${office.address}`
                        : ''}
                    </option>
                  ),
                )}
              </select>
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

          {isLoadingMasterData && (
            <div className="master-data-loading">
              <LoaderCircle
                size={16}
                className="spin"
              />

              Loading work assignment data...
            </div>
          )}

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
              disabled={
                isSubmitting ||
                isLoadingMasterData
              }
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

function getErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    axios.isAxiosError(error)
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