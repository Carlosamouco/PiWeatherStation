/// <reference types="vite-plugin-svgr/client" />

import NotAvailable from "@bybas/weather-icons/production/fill/all/not-available.svg?react";

import ClearDay from "@bybas/weather-icons/production/fill/all/clear-day.svg?react";
import clearNight from "@bybas/weather-icons/production/fill/all/clear-night.svg?react";

import PartlyCloudyDay from "@bybas/weather-icons/production/fill/all/partly-cloudy-day.svg?react";
import PartlyCloudyNight from "@bybas/weather-icons/production/fill/all/partly-cloudy-night.svg?react";

import OvercastDay from "@bybas/weather-icons/production/fill/all/overcast-day.svg?react";
import OvercastNight from "@bybas/weather-icons/production/fill/all/overcast-night.svg?react";

import Overcast from "@bybas/weather-icons/production/fill/all/overcast.svg?react";

import Cloudy from "@bybas/weather-icons/production/fill/all/cloudy.svg?react";

import PartlyCloudyDayDrizzle from "@bybas/weather-icons/production/fill/all/partly-cloudy-day-drizzle.svg?react";
import PartlyCloudyNightDrizzle from "@bybas/weather-icons/production/fill/all/partly-cloudy-night-drizzle.svg?react";

import Drizzle from "@bybas/weather-icons/production/fill/all/drizzle.svg?react";

import PartlyCloudyDayRain from "@bybas/weather-icons/production/fill/all/partly-cloudy-day-rain.svg?react";
import PartlyCloudyNightRain from "@bybas/weather-icons/production/fill/all/partly-cloudy-night-rain.svg?react";

import Rain from "@bybas/weather-icons/production/fill/all/rain.svg?react";

import FogDay from "@bybas/weather-icons/production/fill/all/fog-day.svg?react";
import FogNight from "@bybas/weather-icons/production/fill/all/fog-night.svg?react";

import Mist from "@bybas/weather-icons/production/fill/all/mist.svg?react";

import HazeDay from "@bybas/weather-icons/production/fill/all/haze-day.svg?react";
import HazeNight from "@bybas/weather-icons/production/fill/all/haze-night.svg?react";

import SnowDay from "@bybas/weather-icons/production/fill/all/partly-cloudy-day-snow.svg?react";
import SnowNight from "@bybas/weather-icons/production/fill/all/partly-cloudy-night-snow.svg?react";

import Snow from "@bybas/weather-icons/production/fill/all/snow.svg?react";

import Snowflake from "@bybas/weather-icons/production/fill/all/snowflake.svg?react";

import Thunderstorms from "@bybas/weather-icons/production/fill/all/thunderstorms.svg?react";

import ThunderstormsDayRain from "@bybas/weather-icons/production/fill/all/thunderstorms-day-rain.svg?react";
import ThunderstormsNightRain from "@bybas/weather-icons/production/fill/all/thunderstorms-night-rain.svg?react";

import ThunderstormsRain from "@bybas/weather-icons/production/fill/all/thunderstorms-rain.svg?react";

import Hail from "@bybas/weather-icons/production/fill/all/hail.svg?react";

import Sleet from "@bybas/weather-icons/production/fill/all/sleet.svg?react";

export interface ForecastData {
  dataPrev: string;
  dataUpdate: string;
  ddVento: string;
  ffVento: string;
  globalIdLocal: number;
  hR: string;
  idFfxVento: number;
  idIntensidadePrecipita: number;
  idPeriodo: number;
  idTipoTempo: number;
  probabilidadePrecipita: number;
  tMax: string;
  tMed: string;
  tMin: string;
  utci: string;
}

export const WeatherTypes = [
  { name: "Sem informação", day: NotAvailable, night: NotAvailable },
  { name: "Céu limpo", day: ClearDay, night: clearNight },
  { name: "Céu pouco nublado", day: PartlyCloudyDay, night: PartlyCloudyNight },
  { name: "Céu parcialmente nublado", day: OvercastDay, night: OvercastNight },
  { name: "Céu muito nublado ou encoberto", day: Cloudy, night: Cloudy },
  { name: "Céu nublado por nuvens altas", day: FogDay, night: FogNight },
  {
    name: "Chuva/aguaceiros",
    day: PartlyCloudyDayDrizzle,
    night: PartlyCloudyNightDrizzle,
  },
  {
    name: "Chuva/aguaceiros fracos",
    day: PartlyCloudyDayDrizzle,
    night: PartlyCloudyNightDrizzle,
  },
  {
    name: "Chuva/aguaceiros fortes",
    day: PartlyCloudyDayRain,
    night: PartlyCloudyNightRain,
  },
  { name: "Chuva/aguaceiros", day: Drizzle, night: Drizzle },
  { name: "Chuva fraca ou chuvisco", day: Drizzle, night: Drizzle },
  { name: "Chuva/aguaceiros fortes", day: Rain, night: Rain },
  { name: "Períodos de chuva", day: Rain, night: Rain },
  { name: "Períodos de chuva fraca", day: Rain, night: Rain },
  { name: "Períodos de chuva forte", day: Rain, night: Rain },
  { name: "Chuvisco", day: Drizzle, night: Drizzle },
  { name: "Neblina", day: HazeDay, night: HazeNight },
  { name: "Nevoeiro ou nuvens baixas", day: Mist, night: Mist },
  { name: "Neve", day: Snow, night: Snow },
  { name: "Trovoada", day: Thunderstorms, night: Thunderstorms },
  {
    name: "Aguaceiros e possibilidade de trovoada",
    day: ThunderstormsDayRain,
    night: ThunderstormsNightRain,
  },
  { name: "Granizo", day: Hail, night: Hail },
  { name: "Geada", day: Snowflake, night: Snowflake },
  {
    name: "Chuva e possibilidade de trovoada",
    day: ThunderstormsRain,
    night: ThunderstormsRain,
  },
  { name: "Nebulosidade convectiva", day: Overcast, night: Overcast },
  {
    name: "Céu com períodos de muito nublado",
    day: OvercastDay,
    night: OvercastNight,
  },
  { name: "Nevoeiro", day: Mist, night: Mist },
  { name: "Céu nublado", day: OvercastDay, night: OvercastNight },
  { name: "Aguaceiros de neve", day: SnowDay, night: SnowNight },
  { name: "Chuva e Neve", day: Sleet, night: Sleet },
  { name: "Chuva e Neve", day: Sleet, night: Sleet },
];

export function activeForecast(data: ForecastData[]): ForecastData | undefined {
  const currDate = new Date();
  currDate.setMinutes(0, 0, 0);

  for (const i in data) {
    if (
      new Date(data[i].dataPrev).getTime() === currDate.getTime() &&
      data[i].idPeriodo === 1
    ) {
      return data[i];
    }
  }
}

export function isDay(dataPrev: string | Date) {
  const newDate = typeof dataPrev == "string" ? new Date(dataPrev) : dataPrev;
  const month = newDate.getUTCMonth();
  const hour = newDate.getUTCHours();

  const mainland = [
    { start: 8, end: 17 },
    { start: 8, end: 18 },
    { start: 7, end: 18 },
    { start: 7, end: 20 },
    { start: 7, end: 20 },
    { start: 6, end: 21 },
    { start: 6, end: 21 },
    { start: 7, end: 21 },
    { start: 7, end: 20 },
    { start: 8, end: 19 },
    { start: 7, end: 18 },
    { start: 8, end: 17 },
  ];

  return mainland[month].start <= hour && hour < mainland[month].end;
}
