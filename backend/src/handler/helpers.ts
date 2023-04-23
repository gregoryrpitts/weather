import { URL_REGEX } from "../constants";
import { IForecastResponse } from "../nws/types";
import { IForecastPeriod } from "../nws/types";

export const isUrlGood = (url: string): boolean => {
  return URL_REGEX.test(url);
};

export const extractZip = (url: string): string => {
  return url.split("=")[1];
};

export const pruneData = (data: IForecastResponse): IForecastPeriod[] => {
  return (data.properties?.periods || [])
    .map((period: IForecastPeriod) => {
      return {
        endTime: period.endTime,
        icon: period.icon,
        shortForecast: period.shortForecast,
        startTime: period.startTime,
        temperature: period.temperature,
        temperatureUnit: period.temperatureUnit,
        windSpeed: period.windSpeed,
        windDirection: period.windDirection,
      };
    })
    .slice(0, 18);
};
