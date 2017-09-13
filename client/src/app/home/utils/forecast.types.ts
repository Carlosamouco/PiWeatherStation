export interface DayHistoryData {
  creation_date: string,
  humidity: string,
  measure_id: string,
  pressure: string,
  temperature: string
}


export interface ParamData {
  max: { value: number, date: string }[];
  min: { value: number, date: string }[];
  mid?: number;
}

export interface DayData {
  temperature: ParamData;
  humidity: ParamData;
  pressure: ParamData;
}

export class ForecastData {
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

export enum WindForceTypes {
  'indef',
  'weak',
  'moderate',
  'strong'
}

enum WeatherType {
  CLEAR_DAY, 
  CLEAR_NIGHT,
  PARTLY_CLOUDY_DAY,
  PARTLY_CLOUDY_NIGHT, 
  MOSTLY_PARTLY_CLOUDY_DAY,
  MOSTLY_PARTLY_CLOUDY_NIGHT,
  CLOUDY,
  SHOWERS_DAY,
  SHOWERS_NIGHT,
  LIGHT_SHOWERS_DAY,
  LIGHT_SHOWERS_NIGHT,
  HEAVY_SHOWERS_DAY,
  HEAVY_SHOWERS_NIGHT,
  RAIN,
  LIGHT_RAIN,
  HEAVY_RAIN,
  WIND,    
  SLEET, 
  SNOW, 
  FOG,
  LIGHTNING,
  HEAVY_RAIN_LIGHTNING,
  INTERMITTENT_RAIN_LIGHTNING_DAY,
  INTERMITTENT_RAIN_LIGHTNING_NIGHT,
  HEIGHT_CLOUDS_DAY,
  HEIGHT_CLOUDS_NIGHT
}

export const ForecastTypes = [
  { name: 'Sem informação' },
  { name: 'Céu limpo', day: WeatherType.CLEAR_DAY, night: WeatherType.CLEAR_NIGHT },
  { name: 'Céu pouco nublado', day: WeatherType.PARTLY_CLOUDY_DAY, night: WeatherType.PARTLY_CLOUDY_NIGHT },
  { name: 'Céu parcialmente nublado', day: WeatherType.MOSTLY_PARTLY_CLOUDY_DAY, night: WeatherType.MOSTLY_PARTLY_CLOUDY_DAY },
  { name: 'Céu muito nublado ou encoberto', day: WeatherType.CLOUDY, night: WeatherType.CLOUDY },
  { name: 'Céu nublado por nuvens altas', day: WeatherType.HEIGHT_CLOUDS_DAY, night: WeatherType.HEIGHT_CLOUDS_NIGHT },
  { name: 'Aguaceiros', day: WeatherType.SHOWERS_DAY, night: WeatherType.SHOWERS_NIGHT },
  { name: 'Aguaceiros fracos', day: WeatherType.LIGHT_SHOWERS_DAY, night: WeatherType.LIGHT_SHOWERS_NIGHT },
  { name: 'Aguaceiros fortes', day: WeatherType.HEAVY_SHOWERS_DAY, night: WeatherType.HEAVY_SHOWERS_NIGHT },
  { name: 'Chuva', day: WeatherType.RAIN, night: WeatherType.RAIN },
  { name: 'Chuva fraca ou chuvisco', day: WeatherType.LIGHT_RAIN, night: WeatherType.LIGHT_RAIN },
  { name: 'Chuva forte', day: WeatherType.HEAVY_RAIN, night: WeatherType.HEAVY_RAIN },
  { name: 'Períodos de chuva', day: WeatherType.RAIN, night: WeatherType.RAIN },
  { name: 'Períodos de chuva fraca', day: WeatherType.LIGHT_RAIN, night: WeatherType.LIGHT_RAIN },
  { name: 'Períodos de chuva forte', day: WeatherType.HEAVY_RAIN, night: WeatherType.HEAVY_RAIN },
  { name: 'Chuvisco', day: WeatherType.LIGHT_RAIN, night: WeatherType.LIGHT_RAIN },
  { name: 'Neblina', day: WeatherType.FOG, night: WeatherType.FOG },
  { name: 'Nevoeiro ou nuvens baixas', day: WeatherType.FOG, night: WeatherType.FOG },
  { name: 'Neve', day: WeatherType.SNOW, night: WeatherType.SNOW },
  { name: 'Trovoada', day: WeatherType.LIGHTNING, night: WeatherType.LIGHTNING },
  { name: 'Aguaceiros e trovoada', day: WeatherType.HEAVY_RAIN_LIGHTNING, night: WeatherType.HEAVY_RAIN_LIGHTNING },
  { name: 'Granizo', day: WeatherType.SLEET, night: WeatherType.SLEET },
  { name: 'Geada' },
  { name: 'Chuva forte e trovoada', day: WeatherType.HEAVY_RAIN_LIGHTNING, night: WeatherType.HEAVY_RAIN_LIGHTNING },
  { name: 'Nebulosidade convectiva', day: WeatherType.FOG, night: WeatherType.FOG },
  { name: 'Céu com periodos muito nublado', day: WeatherType.CLOUDY, night: WeatherType.CLOUDY },
  { name: 'Nevoeiro', day: WeatherType.FOG, night: WeatherType.FOG },
  { name: 'Céu nublado', day: WeatherType.CLOUDY, night: WeatherType.CLOUDY }
];
