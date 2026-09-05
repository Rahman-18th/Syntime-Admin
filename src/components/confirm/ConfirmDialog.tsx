import {
  AlertTriangle,
  X,
} from "lucide-react";

import type {
  ConfirmOptions,
} from "./confirm.types";

interface Props {
  open: boolean;
  options: ConfirmOptions | null;

  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  options,
  onConfirm,
  onCancel,
}: Props) {
  if (!open || !options) {
    return null;
  }

  const danger =
    options.tone === "danger";

  return (
    <div
      className="confirm-backdrop"
      onMouseDown={onCancel}
    >
      <div
        className="confirm-dialog"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="confirm-header">
          <div
            className={
              danger
                ? "confirm-icon confirm-icon-danger"
                : "confirm-icon"
            }
          >
            <AlertTriangle
              size={20}
            />
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onCancel}
          >
            <X size={16} />
          </button>
        </div>

        <div className="confirm-content">
          <h3>
            {options.title}
          </h3>

          <p>
            {options.message}
          </p>
        </div>

        <div className="confirm-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            {options.cancelText ??
              "Cancel"}
          </button>

          <button
            type="button"
            className={
              danger
                ? "danger-button"
                : "primary-button"
            }
            onClick={onConfirm}
          >
            {options.confirmText ??
              "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}