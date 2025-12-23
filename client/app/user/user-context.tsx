import { createContext, useContext, useState } from "react";
import { useRouteLoaderData } from "react-router";

export function getCookie(name: string) {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000`;
}

export interface UserSettings {
  theme: "dark" | "light" | null;
}

const UserSettingsContext = createContext<
  [UserSettings, (userPrefs: UserSettings) => void] | null
>(null);

export function useUserSettings() {
  const context = useContext(UserSettingsContext);

  if (!context) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsContext"
    );
  }

  return context;
}

export function UserSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<UserSettings>(
    useRouteLoaderData("root") ?? { theme: null }
  );

  const setUserSettings = (settings: UserSettings) => {
    setPrefs(settings);
    setCookie("user-prefs", JSON.stringify(settings));
  };

  return (
    <UserSettingsContext value={[prefs, setUserSettings]}>
      {children}
    </UserSettingsContext>
  );
}
