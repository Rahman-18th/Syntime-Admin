import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import type {
  Company,
  Department,
  DepartmentPayload,
} from '../types/master-data.types';

interface Props {
  department?: Department | null;
  companies: Company[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    payload: DepartmentPayload,
  ) => Promise<void>;
}

export default function DepartmentFormModal({
  department,
  companies,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const [
    companyId,
    setCompanyId,
  ] =
    useState(
      department?.companyId ?? '',
    );

  const [name, setName] =
    useState(
      department?.name ?? '',
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      department?.description ?? '',
    );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit({
      companyId,
      name: name.trim(),

      ...(description.trim() && {
        description:
          description.trim(),
      }),
    });
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal-card"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Master Data
            </p>

            <h2>
              {department
                ? 'Edit Department'
                : 'New Department'}
            </h2>
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
          <label className="form-field">
            <span>Company</span>

            <select
              value={companyId}
              onChange={(event) =>
                setCompanyId(
                  event.target.value,
                )
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

          <label className="form-field">
            <span>Department Name</span>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              required
            />
          </label>

          <label className="form-field">
            <span>Description</span>

            <textarea
              rows={4}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
            />
          </label>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-button"
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
                ? 'Saving...'
                : 'Save Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}