import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUserSettings } from "~/user/user-context";

const ThemeContext = createContext<
  readonly ["dark" | "light", (theme: "dark" | "light") => void] | null
>(null);

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useUserSettings();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const loadTheme = useCallback((theme: "dark" | "light") => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    setTheme(theme);
    setSettings({ ...settings, theme: theme });
  }, []);

  const contextValue = useMemo(
    () => [theme, loadTheme] as const,
    [theme, loadTheme]
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const theme = settings.theme
      ? settings.theme === "dark"
        ? "dark"
        : "light"
      : media.matches
        ? "dark"
        : "light";

    loadTheme(theme);
  }, [loadTheme]);

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}
