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
  measure?: WeatherHistory;
  selectedField: HistoryField;
  onMeasure?: (data: LiveData) => void;
  onFieldSelected?: (field: HistoryField) => void;
}

export function calculateSeaLevelPressure(
  rawPressure: number,
  tempC: number,
  altitude: number = 179.5
) {
  // Standard barometric formula for altitude compensation
  const ratio = 1 - (0.0065 * altitude) / (tempC + 0.0065 * altitude + 273.15);
  const seaLevelPressure = rawPressure * Math.pow(ratio, -5.257);

  return parseFloat(seaLevelPressure.toFixed(1));
}

function adjustMeasure(
  measure: WeatherHistory | undefined
): WeatherHistory | undefined {
  if (!measure) {
    return;
  }

  const { pressure, temperature } = measure;

  const seaLvlPressure = calculateSeaLevelPressure(
    Number.parseFloat(pressure),
    Number.parseFloat(temperature)
  );

  return {
    ...measure,
    pressure: seaLvlPressure.toString(),
  };
}

export function LiveWeather({
  weather,
  selectedField,
  measure,
  onMeasure,
  onFieldSelected,
}: LiveWeatherProps) {
  const [data, setData] = useState<WeatherHistory | undefined>(
    adjustMeasure(measure)
  );
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
      (liveData: LiveData) => {
        onMeasure?.(liveData);
        setData(adjustMeasure(liveData.currMeasure));
      },
      [onMeasure]
    )
  );

  useSocketIOEvent(
    "reconnect",
    useCallback(async () => {
      try {
        const res = await fetch("/api/weather/last");
        if (res.ok) {
          const data = await res.json();
          onMeasure?.(data);
          setData(adjustMeasure(data));
        }
      } catch {}
    }, [onMeasure])
  );

  const selectCard = useCallback(
    (field: HistoryField) => onFieldSelected?.(field),
    [onFieldSelected]
  );

  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <>
      <BlinkText value={data}>
        <span className="text-7xl">{data?.[selectedField] ?? "--"}</span>
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
              value={data?.[field]}
              units={units}
              selected={selectedField === field}
            />
          </button>
        ))}
      </div>
    </>
  );
}
