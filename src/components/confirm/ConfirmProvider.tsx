import {
  
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import ConfirmDialog
  from "./ConfirmDialog";

import type {
  
  ConfirmOptions,
} from "./confirm.types";

import {
  ConfirmContext,
} from "./ConfirmContext";



export function ConfirmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [
    options,
    setOptions,
  ] =
    useState<ConfirmOptions | null>(
      null
    );

  const resolverRef =
    useRef<
      ((value: boolean) => void) |
        null
    >(null);

  const confirm =
    useCallback(
      (
        nextOptions:
          ConfirmOptions
      ) => {
        setOptions(
          nextOptions
        );

        return new Promise<boolean>(
          (resolve) => {
            resolverRef.current =
              resolve;
          }
        );
      },
      []
    );

  const finish =
    useCallback(
      (value: boolean) => {
        resolverRef.current?.(
          value
        );

        resolverRef.current =
          null;

        setOptions(null);
      },
      []
    );

  const value =
    useMemo(
      () => ({
        confirm,
      }),
      [confirm]
    );

  return (
    <ConfirmContext.Provider
      value={value}
    >
      {children}

      <ConfirmDialog
        open={
          options !== null
        }
        options={options}
        onConfirm={() =>
          finish(true)
        }
        onCancel={() =>
          finish(false)
        }
      />
    </ConfirmContext.Provider>
  );
}