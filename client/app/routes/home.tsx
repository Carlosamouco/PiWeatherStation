import { useCallback, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/home";
import { LiveWeather, type LiveData } from "~/live-weather/live-weather";
import { LocationHeader } from "~/location-header/location-header";
import {
  activeForecast,
  isDay,
  WeatherTypes,
  type ForecastData,
} from "~/forecast/forecast-data";
import {
  WeatherChart,
  type HistoryField,
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

  const [day, setDay] = useState<boolean | null>(null);
  const [history, setHistory] = useState(loaderData?.history ?? []);
  const [field, setField] = useState<HistoryField>("temperature");

  const abortRef = useRef<AbortController | null>(null);

  const onLiveData = useCallback((data: LiveData) => {
    setHistory((prev) => {
      if (prev.at(-1)?.measure_id === data.currMeasure.measure_id) {
        return prev;
      }
      // delete last value if it's older than 24 hours
      return prev.length > 0 &&
        Date.now() - new Date(prev[0].creation_date).getTime() >=
          24 * 60 * 60 * 1000
        ? [...prev.slice(1), data.currMeasure]
        : [...prev, data.currMeasure];
    });
  }, []);

  const onFieldSelected = useCallback((field: HistoryField) => {
    setField(field);
  }, []);

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

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    setDay(isDay(new Date()));
  }, []);

  return (
    <div className="container mx-auto min-h-[100dvh] flex">
      <div className="flex flex-col flex-1 px-4 sm:mx-0 w-full">
        <div className="mt-4">
          <LocationHeader />
          {day ? (
            <weather.day className="max-h-70 min-h-50 h-[30dvw] w-full mx-auto drop-shadow-xl" />
          ) : (
            <weather.night className="max-h-70 min-h-50 h-[30dvw] w-full mx-auto drop-shadow-xl" />
          )}
          <LiveWeather
            weather={weather}
            selectedField={field}
            onData={onLiveData}
            onFieldSelected={onFieldSelected}
          />
        </div>

        <div className="mt-6 mb-4 flex-1 min-h-0 flex flex-col items-center">
          <div className="h-full w-full content-center">
            <div className="min-h-full max-h-70 h-[60dvh] w-full relative">
              <WeatherChart data={history} field={field} />
            </div>
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
