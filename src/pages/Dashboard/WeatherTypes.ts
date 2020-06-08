export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export type FeelsLike = {
  day: number;
  night: number;
  eve: number;
  morn: number;
}

export type CurrentWeather = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: Weather[]
}

export type DailyTemp = {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}

export type Daily = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: DailyTemp,
  feels_like: FeelsLike,
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  weather: Weather[]
}

export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather,
  daily: Daily[]
}
