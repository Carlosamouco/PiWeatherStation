import { useCallback, useEffect, useRef, useState } from "react";
import { WiHumidity } from "react-icons/wi";
import { WiBarometer } from "react-icons/wi";
import { useSocketEvent, useSocketIOEvent } from "~/socket.io/socket-event";
import WeatherIndicator from "~/weather-indicator/weather-indicator";
import BlinkText from "~/blink-text/blink-text";

export type Trend = "up" | "down" | "stable";

export interface Measure {
  pressure: number;
  temperature: number;
  humidity: number;
  creation_date: string;
}

export interface LiveData {
  currMeasure: Measure;
  prevMeasure?: Measure;
}

export interface LiveWeatherProps {
  weather: {
    name: string;
  };
}

export function LiveWeather({ weather }: LiveWeatherProps) {
  const [data, setData] = useState<LiveData>();
  const abortRef = useRef<AbortController | null>(null);

  useSocketEvent(
    "new measurement",
    useCallback((data: LiveData) => {
      setData(data);
    }, [])
  );

  useSocketIOEvent(
    "reconnect",
    useCallback(async () => {
      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/weather/last", {
          signal: abortRef.current.signal,
        });
        setData(await res.json());
        abortRef.current = null;
      } catch {}
    }, [])
  );

  useEffect(() => () => abortRef.current?.abort(), [abortRef]);

  return (
    <>
      <div className="flex flex-row flex">
        <BlinkText>
          <span className="text-7xl">
            {data?.currMeasure.temperature ?? "--"}
          </span>
          <span className="self-start text-2xl">ºC</span>
        </BlinkText>
      </div>

      <div className="text-4xl font-extralight">{weather.name}</div>

      <div className="flex flex-row gap-3 mt-4 overflow-x-auto">
        <WeatherIndicator
          Icon={WiHumidity}
          label="Humidade"
          value={data?.currMeasure.humidity}
          units="%"
        />
        <WeatherIndicator
          Icon={WiBarometer}
          label="Pressão"
          value={data?.currMeasure.pressure}
          units="hPa"
        />
      </div>
    </>
  );
}
