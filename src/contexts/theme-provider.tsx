import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ThemeContext, type Theme } from "@/contexts/theme-context";

interface ThemeProviderProps {
  children: ReactNode;
}

const themeStorageKey = "rugefx-theme";
const themeColors: Record<Theme, string> = {
  light: "#f8f7fb",
  dark: "#120c1a",
};

function isTheme(value: string | null | undefined): value is Theme {
  return value === "light" || value === "dark";
}

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";

  const documentTheme = document.documentElement.dataset.theme;
  if (isTheme(documentTheme)) return documentTheme;

  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    if (isTheme(storedTheme)) return storedTheme;
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", themeColors[theme]);
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // The server and the first hydration render must agree. The inline theme
  // bootstrap updates the document before paint, then this effect synchronizes
  // the React context with that value.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(getInitialTheme());
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    applyTheme(nextTheme);
    setThemeState(nextTheme);

    try {
      window.localStorage.setItem(themeStorageKey, nextTheme);
    } catch {
      // Theme still works for the current page when persistence is unavailable.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [setTheme, theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
