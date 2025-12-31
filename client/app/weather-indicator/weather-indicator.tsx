import { useEffect, useRef, useState, type ReactNode } from "react";
import type { IconType } from "react-icons/lib";
import BlinkText from "~/blink-text/blink-text";

export interface WeatherIndicatorProps {
  Icon?: IconType;
  label: ReactNode;
  value: ReactNode;
  units: ReactNode;
  selected: boolean;
}

export default function WeatherIndicator({
  label,
  value,
  Icon,
  units,
  selected,
}: WeatherIndicatorProps) {
  return (
    <div
      className={`
        ${selected ? "border-3" : "border-transparent"}
        transition-border-color
        rounded-lg
        p-2
        min-w-40
        bg-[color-mix(in_srgb,var(--bg-color)_85%,var(--text-color)_15%)]
      `}
    >
      {Icon ? <Icon className="-ml-2 text-4xl" /> : null}
      {label}
      <div className="flex items-center text-2xl">
        <BlinkText value={value}>
          {value ?? "--"}
          {units}
        </BlinkText>
      </div>
    </div>
  );
}
