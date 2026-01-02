import { useCallback, useEffect, useState } from "react";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { useTheme } from "~/theme/theme-context";

export function LocationHeader() {
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [theme, setTheme] = useTheme();
  const dateStr = dateTime?.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    setDateTime(new Date());
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [theme]);

  return (
    <>
      <div className="flex">
        <div>
          <div className="text-xl font-medium">Marco de Canaveses</div>
          <div className="uppercase text-sm font-light">{dateStr}</div>
        </div>
        <button
          aria-label={`Change theme. Current theme: ${theme}`}
          onClick={toggleTheme}
          className="ml-auto text-3xl self-center"
        >
          {theme === "light" ? <CiLight /> : <CiDark />}
        </button>
      </div>
    </>
  );
}
