import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUserSettings } from "~/user/user-context";
import { isDay } from "~/forecast/forecast-data";

export const THEMES = ["auto", "light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

const ThemeContext = createContext<
  readonly [Theme, (theme: Theme) => void, "light" | "dark"] | null
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
  const theme = settings.theme || "auto";
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    theme === "dark" ? "dark" : "light",
  );

  const setTheme = useCallback(
    (mode: Theme) => setSettings({ ...settings, theme: mode }),
    [settings, setSettings],
  );

  const contextValue = useMemo(
    () => [theme, setTheme, colorScheme] as const,
    [theme, setTheme, colorScheme],
  );

  useEffect(() => {
    const updateTheme = () => {
      const nextTheme =
        theme === "auto" ? (isDay(new Date()) ? "light" : "dark") : theme;
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(nextTheme);
      setColorScheme(nextTheme);
    };

    updateTheme();

    if (theme !== "auto") {
      return;
    }

    const interval = window.setInterval(updateTheme, 30_000);
    return () => window.clearInterval(interval);
  }, [theme]);

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}
