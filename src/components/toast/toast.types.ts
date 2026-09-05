export type ToastType =
  | "success"
  | "error"
  | "info"
  | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

export interface ToastContextValue {
  showToast: (
    toast: Omit<ToastItem, "id">
  ) => void;
}