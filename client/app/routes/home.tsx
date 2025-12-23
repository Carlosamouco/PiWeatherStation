import type { Route } from "./+types/home";
import { LiveWeather } from "~/live-weather/live-weather";
import { LocationHeader } from "~/location-header/location-header";
import {
  activeForecast,
  isDay,
  WeatherTypes,
  type ForecastData,
} from "~/forecast/forecast-data";
import { use, useEffect, useRef } from "react";
import {
  WeatherChart,
  type WeatherHistory,
} from "~/weather-chart/weather-chart";
import { getCookie } from "~/user/user-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meteo - Constance" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
  const [ipmaResponse, weatherResponse] = await Promise.allSettled([
    fetch("https://api.ipma.pt/public-data/forecast/aggregate/1130700.json"),
    fetch("/api/weather/" + yesterday.toISOString() + "/" + now.toISOString()),
  ]);

  const res: {
    forecast?: ForecastData[];
    history?: WeatherHistory[];
  } = {};

  if (ipmaResponse.status === "fulfilled") {
    try {
      res.forecast = await ipmaResponse.value.json();
    } catch {}
  }

  if (weatherResponse.status === "fulfilled") {
    try {
      res.history = await weatherResponse.value.json();
    } catch {}
  }

  return res;
}

interface HomeViewProps {
  loaderData: Awaited<ReturnType<typeof clientLoader>> /* &
    Awaited<ReturnType<typeof loader>> */;
}

function HomeView({ loaderData }: HomeViewProps) {
  const forecast = activeForecast(loaderData?.forecast ?? []);
  const weather = WeatherTypes[forecast?.idTipoTempo ?? 0];
  const isDayRef = useRef<boolean | null>(null);

  useEffect(() => {
    isDayRef.current = isDay(new Date());
  }, []);

  return (
    <div className="container mx-auto min-h-[100dvh] flex">
      <div className="flex flex-col flex-1 mx-4 sm:mx-0">
        <div className="mt-4">
          <LocationHeader />
          {isDayRef.current ? (
            <weather.day className="h-70 mx-auto drop-shadow-xl" />
          ) : (
            <weather.night className="h-70 mx-auto drop-shadow-xl" />
          )}
          <LiveWeather weather={weather} />
        </div>

        <div className="mt-6 mb-4 flex-1 min-h-0 flex items-center">
          <div className="min-h-65 max-h-100 w-full h-full">
            <WeatherChart data={loaderData?.history ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HydrateFallback() {
  return <HomeView loaderData={{}} />;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <HomeView loaderData={loaderData} />;
}
