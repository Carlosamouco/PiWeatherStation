import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WiHumidity, WiBarometer, WiThermometer } from "react-icons/wi";
import { useSocketEvent, useSocketIOEvent } from "~/socket.io/socket-event";
import WeatherIndicator from "~/weather-indicator/weather-indicator";
import BlinkText from "~/blink-text/blink-text";
import type {
  HistoryField,
  WeatherHistory,
} from "~/weather-chart/weather-chart";

export interface LiveData {
  currMeasure: WeatherHistory;
  prevMeasure?: WeatherHistory;
}

export interface LiveWeatherProps {
  weather: {
    name: string;
  };
  selectedField: HistoryField;
  onData?: (data: LiveData) => void;
  onFieldSelected?: (field: HistoryField) => void;
}

export function LiveWeather({
  weather,
  selectedField,
  onData,
  onFieldSelected,
}: LiveWeatherProps) {
  const [data, setData] = useState<LiveData>();
  const abortRef = useRef<AbortController | null>(null);
  const historyFields = useMemo(
    () =>
      [
        {
          Icon: WiThermometer,
          label: "Temperatura",
          field: "temperature",
          units: "ºC",
        },
        {
          Icon: WiHumidity,
          label: "Humidade",
          field: "humidity",
          units: "%",
        },
        {
          Icon: WiBarometer,
          label: "Pressão",
          field: "pressure",
          units: "hPa",
        },
      ] as const,
    []
  );

  useSocketEvent(
    "new measurement",
    useCallback(
      (data: LiveData) => {
        onData?.(data);
        setData(data);
      },
      [onData]
    )
  );

  useSocketIOEvent(
    "reconnect",
    useCallback(async () => {
      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/weather/last", {
          signal: abortRef.current.signal,
        });
        if (res.ok) {
          const data = await res.json();
          onData?.(data);
          setData(data);
        }
        abortRef.current = null;
      } catch {}
    }, [onData])
  );

  const selectCard = useCallback(
    (field: HistoryField) => onFieldSelected?.(field),
    [onFieldSelected]
  );

  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <>
      <BlinkText value={data?.currMeasure}>
        <span className="text-7xl">
          {data?.currMeasure[selectedField] ?? "--"}
        </span>
        <span className="self-start text-2xl">
          {historyFields.find((t) => t.field === selectedField)?.units}
        </span>
      </BlinkText>

      <div className="text-4xl font-extralight">{weather.name}</div>

      <div className="flex flex-row gap-3 mt-4 snap-x snap-mandatory overflow-x-auto w-full min-w-0">
        {historyFields.map(({ Icon, label, field, units }, index, list) => (
          <button
            className={
              "text-left " +
              (index === 0
                ? "snap-start"
                : index < list.length - 1
                  ? "snap-center"
                  : "snap-end")
            }
            key={field}
            ref={(el) => {
              if (el && selectedField === field) {
                el.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center",
                });
              }
            }}
            onClick={() => selectCard(field)}
          >
            <WeatherIndicator
              Icon={Icon}
              label={label}
              value={data?.currMeasure[field]}
              units={units}
              selected={selectedField === field}
            />
          </button>
        ))}
      </div>
    </>
  );
}
