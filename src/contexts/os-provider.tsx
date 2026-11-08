import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  projectAppId,
  projectSlugFromApp,
  projectSlugFromPath,
  type AppId,
} from "@/components/os/apps";
import {
  OSContext,
  centerOf,
  type DialogOptions,
  type OSContextValue,
  type OSWindow,
  type OpenOptions,
  type Point,
} from "@/contexts/os-context";
import { usePlayground } from "@/contexts/playground-context";

interface WindowState {
  windows: OSWindow[];
  stack: number[];
  focusedKey: number | null;
  nextKey: number;
}

type WindowAction =
  | { type: "open"; id: AppId; origin: Point | null }
  | { type: "close"; key: number }
  | { type: "focus"; key: number }
  | { type: "minimize"; key: number }
  | { type: "replace"; key: number; id: AppId }
  | { type: "reset"; ids: AppId[] };

/** The windows that are open when the page loads, from bottom to top. */
function startupApps(pathname: string): AppId[] {
  const slug = projectSlugFromPath(pathname);
  return slug
    ? ["projects", projectAppId(slug)]
    : ["about", "projects", "welcome"];
}

function bootState(ids: AppId[], firstKey: number): WindowState {
  const windows = ids.map((id, index) => ({
    key: firstKey + index,
    id,
    minimized: false,
    origin: null,
    bootIndex: index,
  }));
  return {
    windows,
    stack: windows.map(({ key }) => key),
    focusedKey: windows.at(-1)?.key ?? null,
    nextKey: firstKey + windows.length,
  };
}

function raise(stack: number[], key: number) {
  return [...stack.filter((other) => other !== key), key];
}

function topVisible(windows: OSWindow[], stack: number[]) {
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    const window = windows.find(({ key }) => key === stack[index]);
    if (window && !window.minimized) return window.key;
  }
  return null;
}

function windowReducer(state: WindowState, action: WindowAction): WindowState {
  switch (action.type) {
    case "open": {
      const existing = state.windows.find(({ id }) => id === action.id);
      if (existing) {
        return windowReducer(state, { type: "focus", key: existing.key });
      }
      const key = state.nextKey;
      return {
        windows: [
          ...state.windows,
          {
            key,
            id: action.id,
            minimized: false,
            origin: action.origin,
            bootIndex: null,
          },
        ],
        stack: [...state.stack, key],
        focusedKey: key,
        nextKey: key + 1,
      };
    }
    case "close": {
      const windows = state.windows.filter(({ key }) => key !== action.key);
      const stack = state.stack.filter((key) => key !== action.key);
      return {
        ...state,
        windows,
        stack,
        focusedKey: topVisible(windows, stack),
      };
    }
    case "focus": {
      const windows = state.windows.map((window) =>
        window.key === action.key && window.minimized
          ? { ...window, minimized: false }
          : window,
      );
      return {
        ...state,
        windows,
        stack: raise(state.stack, action.key),
        focusedKey: action.key,
      };
    }
    case "minimize": {
      const windows = state.windows.map((window) =>
        window.key === action.key ? { ...window, minimized: true } : window,
      );
      return {
        ...state,
        windows,
        focusedKey: topVisible(windows, state.stack),
      };
    }
    case "replace": {
      const existing = state.windows.find(({ id }) => id === action.id);
      if (existing) {
        return windowReducer(state, { type: "focus", key: existing.key });
      }
      return {
        ...state,
        windows: state.windows.map((window) =>
          window.key === action.key ? { ...window, id: action.id } : window,
        ),
        stack: raise(state.stack, action.key),
        focusedKey: action.key,
      };
    }
    case "reset":
      return bootState(action.ids, state.nextKey);
  }
}

interface OSProviderProps {
  children: ReactNode;
}

/** The RugeOS window manager: windows, dialogs, power and the phone's open app. */
export function OSProvider({ children }: OSProviderProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const { play } = usePlayground();
  const [state, dispatch] = useReducer(windowReducer, pathname, (path) =>
    bootState(startupApps(path), 1),
  );
  const [phone, setPhone] = useState<{
    app: AppId | null;
    origin: Point | null;
  }>(() => {
    const slug = projectSlugFromPath(pathname);
    return { app: slug ? projectAppId(slug) : null, origin: null };
  });
  const [dialog, setDialog] = useState<OSContextValue["dialog"]>(null);
  const [plainView, setPlainView] = useState(false);
  const [power, setPower] = useState<"on" | "off">("on");
  const [bootCount, setBootCount] = useState(0);
  const pathnameRef = useRef(pathname);
  const windowsRef = useRef(state.windows);
  const phoneRef = useRef(phone);
  const pending = useRef<{ origin: Point | null; replaceKey?: number } | null>(
    null,
  );

  useEffect(() => {
    pathnameRef.current = pathname;
    windowsRef.current = state.windows;
    phoneRef.current = phone;
  });

  const reveal = useCallback((id: AppId) => {
    const { origin = null, replaceKey } = pending.current ?? {};
    pending.current = null;
    dispatch(
      replaceKey === undefined
        ? { type: "open", id, origin }
        : { type: "replace", key: replaceKey, id },
    );
    setPhone({ app: id, origin });
  }, []);

  // Project windows have real URLs: opening one navigates, and landing on a
  // project URL opens its window.
  useEffect(() => {
    const slug = projectSlugFromPath(pathname);
    if (slug) reveal(projectAppId(slug));
  }, [pathname, reveal]);

  const openProject = useCallback<OSContextValue["openProject"]>(
    (slug, options = {}) => {
      play("open");
      pending.current = {
        origin: centerOf(options.from),
        replaceKey: options.replaceKey,
      };
      if (projectSlugFromPath(pathnameRef.current) === slug) {
        reveal(projectAppId(slug));
      } else {
        void navigate({
          to: "/projects/$projectSlug",
          params: { projectSlug: slug },
        });
      }
    },
    [navigate, play, reveal],
  );

  const open = useCallback(
    (id: AppId, options: OpenOptions = {}) => {
      const slug = projectSlugFromApp(id);
      if (slug) return openProject(slug, options);
      play("open");
      const origin = centerOf(options.from);
      dispatch({ type: "open", id, origin });
      setPhone({ app: id, origin });
    },
    [openProject, play],
  );

  const leaveProject = useCallback(
    (id: AppId) => {
      const slug = projectSlugFromApp(id);
      if (slug && projectSlugFromPath(pathnameRef.current) === slug) {
        void navigate({ to: "/" });
      }
    },
    [navigate],
  );

  const close = useCallback(
    (key: number) => {
      const window = windowsRef.current.find((other) => other.key === key);
      play("close");
      dispatch({ type: "close", key });
      if (window) leaveProject(window.id);
    },
    [leaveProject, play],
  );

  const closePhoneApp = useCallback(() => {
    const { app, origin } = phoneRef.current;
    play("close");
    setPhone({ app: null, origin });
    if (app) leaveProject(app);
  }, [leaveProject, play]);

  const focus = useCallback((key: number) => {
    dispatch({ type: "focus", key });
  }, []);

  const minimize = useCallback(
    (key: number) => {
      play("minimize");
      dispatch({ type: "minimize", key });
    },
    [play],
  );

  const showDialog = useCallback(
    (options: DialogOptions) => {
      play(options.icon === "error" ? "error" : "notify");
      setDialog({ ...options, id: Date.now() });
    },
    [play],
  );

  const dismissDialog = useCallback(() => setDialog(null), []);

  const shutDown = useCallback(() => {
    play("shutdown");
    setDialog(null);
    setPlainView(false);
    setPower("off");
  }, [play]);

  const powerOn = useCallback(() => {
    play("startup");
    pending.current = null;
    dispatch({ type: "reset", ids: startupApps("/") });
    setPhone({ app: null, origin: null });
    setBootCount((count) => count + 1);
    setPower("on");
    if (pathnameRef.current !== "/") void navigate({ to: "/" });
  }, [navigate, play]);

  const value = useMemo<OSContextValue>(
    () => ({
      windows: state.windows,
      stack: state.stack,
      focusedKey: state.focusedKey,
      open,
      openProject,
      close,
      focus,
      minimize,
      phoneApp: phone.app,
      phoneOrigin: phone.origin,
      closePhoneApp,
      dialog,
      showDialog,
      dismissDialog,
      plainView,
      setPlainView,
      power,
      bootCount,
      shutDown,
      powerOn,
    }),
    [
      bootCount,
      close,
      closePhoneApp,
      dialog,
      dismissDialog,
      focus,
      minimize,
      open,
      openProject,
      phone,
      plainView,
      power,
      powerOn,
      showDialog,
      shutDown,
      state,
    ],
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}
