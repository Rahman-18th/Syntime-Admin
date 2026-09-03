import {
  useState,
} from 'react';

import {
  Check,
  Copy,
  KeyRound,
  X,
} from 'lucide-react';

interface AccountCredentialModalProps {
  email: string;
  temporaryPassword: string;
  title: string;
  onClose: () => void;
}

export default function AccountCredentialModal({
  email,
  temporaryPassword,
  title,
  onClose,
}: AccountCredentialModalProps) {
  const [copied, setCopied] =
    useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(
      temporaryPassword,
    );

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1600);
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal-card credential-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <p className="page-eyebrow">
              Login Account
            </p>

            <h2>{title}</h2>

            <p>
              Save this temporary password
              before closing this window.
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

        <div className="credential-icon">
          <KeyRound size={28} />
        </div>

        <div className="credential-grid">
          <div className="credential-field">
            <span>Email</span>

            <strong>{email}</strong>
          </div>

          <div className="credential-field">
            <span>
              Temporary Password
            </span>

            <div className="credential-password">
              <code>
                {temporaryPassword}
              </code>

              <button
                type="button"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={15} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="credential-warning">
          Password ini hanya ditampilkan
          sekarang. Setelah modal ditutup,
          admin harus melakukan reset password
          kalau password hilang.
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="primary-button"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}