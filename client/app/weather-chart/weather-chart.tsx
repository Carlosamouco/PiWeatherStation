import { useEffect, useRef, useState } from "react";

import {
  D3WeatherChart,
  type AggregatedPoint,
  type DataPoint,
  type RealPoint,
} from "./d3-chart";
import { useTheme } from "~/theme/theme-context";

import mockData from "./data.json";

export interface WeatherHistory {
  measure_id: string;
  creation_date: string;
  humidity: string;
  pressure: string;
  temperature: string;
}

export interface WeatherChartProps {
  data: WeatherHistory[];
}

export function WeatherChart({ data }: WeatherChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<D3WeatherChart>(null);
  const [theme] = useTheme();

  const [point, setPoint] = useState<RealPoint | AggregatedPoint | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chart.current = new D3WeatherChart(chartRef.current, setPoint);
    }

    return () => chart.current?.destroy();
  }, []);

  useEffect(() => {
    if (chart.current && data) {
      chart.current.draw(processHistory(data));
    }
  }, [data, theme]);

  if (!data || data.length === 0) {
    return (
      <div className="h-full text-center content-center text-2xl">
        Sem dados disponíveis
      </div>
    );
  }

  return (
    <div ref={chartRef} className="relative w-full h-full">
      <canvas className="absolute inset-0 w-full h-full"></canvas>
      <canvas className="absolute inset-0 w-full h-full"></canvas>
      <div className="absolute px-2 py-1 rounded pointer-events-none hidden text-sm bg-[color-mix(in_srgb,color-mix(in_srgb,var(--bg-color)_85%,var(--text-color)_15%)_80%,transparent_20%)]">
        <div className="flex flex-row items-center">
          {/* <FaRegClock /> */}
          <span className=" font-bold">
            {point?.x.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex flex-row items-center">
          {/* <FaTemperatureHalf /> */}
          <span className="">{point?.y}º</span>
        </div>
      </div>
    </div>
  );
}

function processHistory(data: WeatherHistory[]): DataPoint[] {
  return data.map((d) => ({
    x: new Date(d.creation_date),
    y: Number.parseFloat(d.temperature),
  }));
}
