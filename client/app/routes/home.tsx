import type { Route } from "./+types/home";
import { LiveWeather, type LiveData } from "~/live-weather/live-weather";
import { LocationHeader } from "~/location-header/location-header";
import {
  activeForecast,
  isDay,
  WeatherTypes,
  type ForecastData,
} from "~/forecast/forecast-data";
import { use, useCallback, useEffect, useRef, useState } from "react";
import {
  WeatherChart,
  type WeatherHistory,
} from "~/weather-chart/weather-chart";
import { useSocketIOEvent } from "~/socket.io/socket-event";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RasPi Meteo" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function fetchHistory(init?: RequestInit) {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);

  return fetch(
    "/api/weather/" + yesterday.toISOString() + "/" + now.toISOString(),
    init
  );
}

export async function clientLoader() {
  const [ipmaResponse, weatherResponse] = await Promise.allSettled([
    fetch("https://api.ipma.pt/public-data/forecast/aggregate/1130700.json"),
    fetchHistory(),
  ]);

  const res: {
    forecast?: ForecastData[];
    history?: WeatherHistory[];
  } = {};

  if (ipmaResponse.status === "fulfilled" && ipmaResponse.value.ok) {
    try {
      res.forecast = await ipmaResponse.value.json();
    } catch {}
  }

  if (weatherResponse.status === "fulfilled" && weatherResponse.value.ok) {
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
  const abortRef = useRef<AbortController | null>(null);
  const [history, setHistory] = useState(loaderData?.history ?? []);

  const onData = useCallback(
    (data: LiveData) => {
      if (history.at(-1)?.measure_id !== data.currMeasure.measure_id) {
        setHistory((prev) =>
          // delete last value if it's older than 24 hours
          prev.length > 1 &&
          Date.now() - new Date(prev[0].creation_date).getTime() <=
            24 * 60 * 60 * 1000
            ? [...prev.slice(1), data.currMeasure]
            : [...prev, data.currMeasure]
        );
      }
    },
    [history]
  );

  useSocketIOEvent(
    "reconnect",
    useCallback(async () => {
      abortRef.current = new AbortController();

      try {
        const res = await fetchHistory({
          signal: abortRef.current.signal,
        });

        if (res.ok) {
          setHistory(await res.json());
        }

        abortRef.current = null;
      } catch {}
    }, [])
  );

  useEffect(() => () => abortRef.current?.abort(), [abortRef]);

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
          <LiveWeather weather={weather} onData={onData} />
        </div>

        <div className="mt-6 mb-4 flex-1 min-h-0 flex items-center">
          <div className="min-h-65 w-full h-full">
            <WeatherChart data={history} />
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
