import { createContext, useContext, type ReactNode } from "react";
import type { AppId } from "@/components/os/apps";
import type { ProjectSlug } from "@/content/project-slugs";

export interface Point {
  x: number;
  y: number;
}

export interface OSWindow {
  key: number;
  id: AppId;
  minimized: boolean;
  /** Where the window grows from: the icon or button that opened it. */
  origin: Point | null;
  /** Position in the start-up cascade, for windows that open with the page. */
  bootIndex: number | null;
}

export type DialogIcon = "info" | "error" | "warning" | "question";

export interface DialogButton {
  label: string;
  onClick?: () => void;
}

export interface DialogOptions {
  title: string;
  message: ReactNode;
  icon?: DialogIcon;
  /** Defaults to a single OK button. The first button gets focus. */
  buttons?: DialogButton[];
}

export interface OpenOptions {
  from?: Element | null;
}

export interface OSContextValue {
  windows: OSWindow[];
  /** Window keys from bottom to top. */
  stack: number[];
  focusedKey: number | null;
  open: (id: AppId, options?: OpenOptions) => void;
  openProject: (
    slug: ProjectSlug,
    options?: OpenOptions & { replaceKey?: number },
  ) => void;
  close: (key: number) => void;
  focus: (key: number) => void;
  minimize: (key: number) => void;
  phoneApp: AppId | null;
  phoneOrigin: Point | null;
  closePhoneApp: () => void;
  dialog: (DialogOptions & { id: number }) | null;
  showDialog: (options: DialogOptions) => void;
  dismissDialog: () => void;
  plainView: boolean;
  setPlainView: (open: boolean) => void;
  power: "on" | "off";
  bootCount: number;
  shutDown: () => void;
  powerOn: () => void;
}

export const OSContext = createContext<OSContextValue | null>(null);

export function useOS(): OSContextValue {
  const context = useContext(OSContext);

  if (!context) {
    throw new Error("useOS must be used within an OSProvider.");
  }

  return context;
}

export function centerOf(element: Element | null | undefined): Point | null {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}
