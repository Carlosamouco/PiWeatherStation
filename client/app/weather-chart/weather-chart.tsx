import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { D3WeatherChart, type DataPoint } from "./d3-weather-chart";
import { useTheme } from "~/theme/theme-context";

import mockData from "./data.json";

export interface WeatherHistory {
  measure_id: string;
  creation_date: string;
  humidity: string;
  pressure: string;
  temperature: string;
}

export type HistoryField = "humidity" | "pressure" | "temperature";

export interface WeatherChartProps {
  data: WeatherHistory[];
  field: HistoryField;
}

const temperatureColorScale = d3
  .scaleLinear<string>()
  .domain([-Infinity, -10, 0, 8, 15, 22, 28, 34, 40, 46, Infinity])
  .range([
    "#3F51B5", // -Infinity
    "#3F51B5", // -10
    "#2196F3", // 0
    "#00BCD4", // 8
    "#009688", // 15
    "#8BC34A", // 22
    "#FFEB3B", // 28
    "#FF9800", // 34
    "#F44336", // 40
    "#880E4F", // 46
    "#880E4F", // Infinity
  ]);

const pressureColorScaleDark = d3
  .scaleLinear<string>()
  .domain([960, 990, 1005, 1013, 1022, 1035, 1050])
  .range([
    "#D81B60", // 960: Severe Storm (Magenta)
    "#9575CD", // 990: Low (Muted Purple)
    "#B2EBF2", // 1005: Unsettled (Soft Cyan-Blue Bridge)
    "#e5edf5", // 1013: NORMAL (Your Light Anchor)
    "#81D4FA", // 1022: Rising (Pale Sky Blue Bridge)
    "#29B6F6", // 1035: High (Vibrant Blue)
    "#01579B", // 1050: Extreme High (Deep Sapphire)
  ]);

const pressureColorScaleLight = d3
  .scaleLinear<string>()
  .domain([960, 990, 1005, 1013, 1020, 1030, 1050])
  .range([
    "#D81B60", // 960: Severe Storm (Magenta)
    "#7E57C2", // 990: Rainy/Low (Purple)
    "#455A64", // 1005: Unsettled (Slate Blue)
    "#303745", // 1013: NORMAL (Your Anchor)
    "#40739e", // 1020: Rising (Steel Blue - THE BRIDGE)
    "#00a8ff", // 1030: High (Bright Sky Blue)
    "#00E5FF", // 1050: Extreme High (Electric Cyan)
  ]);

const humidityColorScale = d3
  .scaleLinear<string>()
  .domain([-Infinity, 0, 20, 40, 60, 80, 100, Infinity])
  .range([
    "#FF8F00", // -Infinity
    "#FF8F00", // 0-20%
    "#DCE775", // 40%:
    "#4CAF50", // 60%:
    "#00B0FF", // 80%
    "#2962FF", // 100%
    "#1A237E", // 100%
    "#1A237E", // Infinity
  ]);

export function WeatherChart({ data, field }: WeatherChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<D3WeatherChart>(null);
  const [theme] = useTheme();

  const [point, setPoint] = useState<DataPoint | null>(null);

  const getUnits = () =>
    field === "temperature" ? "º" : field === "pressure" ? "" : "%";

  const getColorScale = () => {
    if (field === "temperature") {
      return theme === "dark" ? temperatureColorScale : temperatureColorScale;
    } else if (field === "pressure") {
      return theme === "dark"
        ? pressureColorScaleDark
        : pressureColorScaleLight;
    } else {
      return humidityColorScale;
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      chart.current = new D3WeatherChart({
        container: chartRef.current,
        units: getUnits(),
        colorScale: getColorScale(),
        setTooltip: setPoint,
      });
    }

    return () => chart.current?.destroy();
  }, []);

  useEffect(() => {
    if (chart.current && data) {
      chart.current.units = getUnits();
      ((chart.current.colorScale = getColorScale()),
        chart.current.draw(processHistory(data, field)));
    }
  }, [data, theme, field]);

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
      <div
        className="
          absolute
          px-2
          py-1
          rounded
          pointer-events-none
          hidden
          text-sm
          bg-[color-mix(in_srgb,color-mix(in_srgb,var(--bg-color)_85%,var(--text-color)_15%)_90%,transparent_10%)]
        "
      >
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
          <span className="">
            {point?.y}
            {getUnits()}
          </span>
        </div>
      </div>
    </div>
  );
}

function calculateSeaLevelPressure(
  rawPressure: number,
  tempC: number,
  altitude: number = 210
) {
  // Standard barometric formula for altitude compensation
  const ratio = 1 - (0.0065 * altitude) / (tempC + 0.0065 * altitude + 273.15);
  const seaLevelPressure = rawPressure * Math.pow(ratio, -5.257);

  return parseFloat(seaLevelPressure.toFixed(1));
}

function processHistory(
  data: WeatherHistory[],
  kind: WeatherChartProps["field"]
): DataPoint[] {
  return data.map((d) => {
    let y = Number.parseFloat(d[kind]);

    if (kind === "pressure") {
      y = calculateSeaLevelPressure(
        Number.parseFloat(d.pressure),
        Number.parseFloat(d.temperature),
        179.5
      );
    }

    return {
      x: new Date(d.creation_date),
      y: y,
    };
  });
}
