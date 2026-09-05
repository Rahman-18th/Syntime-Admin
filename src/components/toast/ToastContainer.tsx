import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";

import type {
  ToastItem,
} from "./toast.types";

interface Props {
  toasts: ToastItem[];
  onRemove: (
    id: string
  ) => void;
}

export default function ToastContainer({
  toasts,
  onRemove,
}: Props) {
  return (
    <div className="toast-container">
      {toasts.map(
        (toast) => {
          const Icon =
            getToastIcon(
              toast.type
            );

          return (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
            >
              <div className="toast-icon">
                <Icon
                  size={18}
                />
              </div>

              <div className="toast-content">
                <strong>
                  {toast.title}
                </strong>

                {toast.message && (
                  <span>
                    {toast.message}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="toast-close"
                onClick={() =>
                  onRemove(
                    toast.id
                  )
                }
              >
                <X size={15} />
              </button>
            </div>
          );
        }
      )}
    </div>
  );
}

function getToastIcon(
  type: ToastItem["type"]
) {
  switch (type) {
    case "success":
      return CheckCircle2;

    case "error":
      return XCircle;

    case "warning":
      return AlertTriangle;

    default:
      return Info;
  }
}