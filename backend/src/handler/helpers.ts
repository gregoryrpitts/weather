import { URL_REGEX } from "../constants";
import { IForecastResponse } from "../nws/types";
import { IForecastPeriod } from "../nws/types";
import { IForecastHourlyResponse } from "../nws/types";

export const isUrlGood = (url: string): boolean => {
  return URL_REGEX.test(url);
};

export const extractZip = (url: string): string => {
  return url.split("=")[1];
};

export const pruneData = (data: IForecastResponse): IForecastPeriod[] => {
  return (data.properties?.periods || [])
    .map((period: IForecastHourlyResponse) => {
      return {
        endTime: new Date(period.endTime).toISOString(),
        icon: period.icon,
        shortForecast: period.shortForecast,
        startTime: period.startTime, //new Date(period.startTime).toISOString(),
        temperature: period.temperature,
        startTimeZone: period.startTime.slice(-6),
        windSpeed: period.windSpeed,
        windDirection: period.windDirection,
      };
    })
    .slice(0, 18);
};
