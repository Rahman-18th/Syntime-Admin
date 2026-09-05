export type ConfirmTone =
  | "default"
  | "danger";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
}

export interface ConfirmContextValue {
  confirm: (
    options: ConfirmOptions
  ) => Promise<boolean>;
}