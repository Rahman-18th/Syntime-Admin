import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import type {
  Company,
  Office,
  OfficePayload,
} from '../types/master-data.types';

interface Props {
  office?: Office | null;
  companies: Company[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    payload: OfficePayload,
  ) => Promise<void>;
}

export default function OfficeFormModal({
  office,
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
      office?.companyId ?? '',
    );

  const [name, setName] =
    useState(
      office?.name ?? '',
    );

  const [address, setAddress] =
    useState(
      office?.address ?? '',
    );

  const [latitude, setLatitude] =
    useState(
      office?.latitude?.toString() ??
        '',
    );

  const [longitude, setLongitude] =
    useState(
      office?.longitude?.toString() ??
        '',
    );

  const [
    allowedRadiusMeters,
    setAllowedRadiusMeters,
  ] =
    useState(
      office?.allowedRadiusMeters
        ?.toString() ?? '150',
    );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit({
      companyId,
      name: name.trim(),

      ...(address.trim() && {
        address: address.trim(),
      }),

      ...(latitude !== '' && {
        latitude:
          Number(latitude),
      }),

      ...(longitude !== '' && {
        longitude:
          Number(longitude),
      }),

      ...(allowedRadiusMeters !== '' && {
        allowedRadiusMeters:
          Number(
            allowedRadiusMeters,
          ),
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
              {office
                ? 'Edit Office'
                : 'New Office'}
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
            <span>Office Name</span>

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
            <span>Address</span>

            <input
              value={address}
              onChange={(event) =>
                setAddress(
                  event.target.value,
                )
              }
            />
          </label>

          <div className="form-grid">
            <label className="form-field">
              <span>Latitude</span>

              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(event) =>
                  setLatitude(
                    event.target.value,
                  )
                }
              />
            </label>

            <label className="form-field">
              <span>Longitude</span>

              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(event) =>
                  setLongitude(
                    event.target.value,
                  )
                }
              />
            </label>
          </div>

          <label className="form-field">
            <span>
              Allowed Radius (Meters)
            </span>

            <input
              type="number"
              min="1"
              value={
                allowedRadiusMeters
              }
              onChange={(event) =>
                setAllowedRadiusMeters(
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
                : 'Save Office'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}