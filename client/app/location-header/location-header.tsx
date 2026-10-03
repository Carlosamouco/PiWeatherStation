import { useCallback, useEffect, useState } from "react";
import { CiDark } from "react-icons/ci";
import { CiLight } from "react-icons/ci";
import { TbSunMoon } from "react-icons/tb";
import { THEMES, useTheme } from "~/theme/theme-context";

export function LocationHeader() {
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [theme, setTheme] = useTheme();

  const themeLabel = {
    auto: "Automático",
    light: "Claro",
    dark: "Escuro",
  } as const;

  const dateStr = dateTime?.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const themeIcon = {
    auto: <TbSunMoon strokeWidth={1} />,
    light: <CiLight />,
    dark: <CiDark />,
  } as const;

  useEffect(() => {
    setDateTime(new Date());
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(newTheme);
  }, [theme, setTheme]);

  return (
    <>
      <div className="flex">
        <div>
          <div className="text-xl font-medium">Marco de Canaveses</div>
          <div className="uppercase text-sm font-light min-h-5">{dateStr}</div>
        </div>
        <button
          aria-label={`Alterar tema. Tema atual: ${themeLabel[theme]}`}
          title={`Tema: ${themeLabel[theme]}`}
          onClick={toggleTheme}
          className="ml-auto text-3xl self-center"
        >
          {themeIcon[theme]}
        </button>
      </div>
    </>
  );
}
