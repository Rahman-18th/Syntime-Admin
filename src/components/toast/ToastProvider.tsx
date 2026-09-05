import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

import ToastContainer from "./ToastContainer";

import type {
  ToastContextValue,
  ToastItem,
} from "./toast.types";

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext =
  createContext<ToastContextValue | null>(
    null
  );

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] =
    useState<ToastItem[]>([]);

  const removeToast =
    useCallback((id: string) => {
      setToasts((current) =>
        current.filter(
          (toast) =>
            toast.id !== id
        )
      );
    }, []);

  const showToast =
    useCallback(
      (
        toast: Omit<
          ToastItem,
          "id"
        >
      ) => {
        const id =
          crypto.randomUUID();

        const newToast: ToastItem =
          {
            id,
            ...toast,
          };

        setToasts((current) => [
          ...current,
          newToast,
        ]);

        window.setTimeout(
          () => {
            removeToast(id);
          },
          3500
        );
      },
      [removeToast]
    );

  const value =
    useMemo(
      () => ({
        showToast,
      }),
      [showToast]
    );

  return (
    <ToastContext.Provider
      value={value}
    >
      {children}

      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />
    </ToastContext.Provider>
  );
}