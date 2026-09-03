import {
  useState,
} from 'react';

import {
  X,
} from 'lucide-react';

import type {
  Company,
  CompanyPayload,
} from '../types/master-data.types';

interface Props {
  company?: Company | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    payload: CompanyPayload,
  ) => Promise<void>;
}

export default function CompanyFormModal({
  company,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] =
    useState(company?.name ?? '');

  const [address, setAddress] =
    useState(company?.address ?? '');

  const [phone, setPhone] =
    useState(company?.phone ?? '');

  const [email, setEmail] =
    useState(company?.email ?? '');

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit({
      name: name.trim(),

      ...(address.trim() && {
        address: address.trim(),
      }),

      ...(phone.trim() && {
        phone: phone.trim(),
      }),

      ...(email.trim() && {
        email: email.trim(),
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
              {company
                ? 'Edit Company'
                : 'New Company'}
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
            <span>Company Name</span>

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
              <span>Phone</span>

              <input
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value,
                  )
                }
              />
            </label>

            <label className="form-field">
              <span>Email</span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
              />
            </label>
          </div>

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
                : 'Save Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}