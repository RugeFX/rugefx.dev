import { createContext, useContext } from "react";

export interface AppFrameContextValue {
  /** Closes the window or phone sheet the app is shown in. */
  close: () => void;
  /** The desktop window's key; undefined on the phone. */
  windowKey?: number;
  isPhone: boolean;
}

export const AppFrameContext = createContext<AppFrameContextValue | null>(null);

export function useAppFrame(): AppFrameContextValue {
  const context = useContext(AppFrameContext);

  if (!context) {
    throw new Error("useAppFrame must be used inside a window or phone sheet.");
  }

  return context;
}
