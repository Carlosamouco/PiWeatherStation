import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useUserSettings } from "~/user/user-context";
import { isDay } from "~/forecast/forecast-data";

export const THEMES = ["auto", "light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

const ThemeContext = createContext<
  readonly [Theme, (theme: Theme) => void] | null
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
  const theme = settings.theme ?? "auto";

  const setTheme = useCallback(
    (mode: Theme) => setSettings({ ...settings, theme: mode }),
    [settings, setSettings],
  );

  const contextValue = useMemo(
    () => [theme, setTheme] as const,
    [settings.theme, setTheme],
  );

  useEffect(() => {
    const updateTheme = () => {
      const resolvedTheme =
        theme === "auto" ? (isDay(new Date()) ? "light" : "dark") : theme;
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(resolvedTheme);
    };

    updateTheme();

    if (theme !== "auto") {
      return;
    }

    const interval = window.setInterval(updateTheme, 30_000);
    return () => window.clearInterval(interval);
  }, [settings.theme]);

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}
