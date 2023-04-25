import React from "react";

import { IUseWeatherApi } from "services/api/weatherApi";
import useWeatherApi from "services/api/weatherApi";

import { IWeatherResponse } from "types/weather";

export interface IUseWeather {
  /**
   * Fetch weather for a Zip code.
   *
   * @param zipCode The 5 digit zip code to fetch weather for.
   * @returns A promise that resolves when the weather has been fetched.
   */
  fetchWeather: (zipCode: string) => Promise<void>;
  /**
   * Whether or not the weather is currently being fetched.
   */
  isLoading: boolean;
  /**
   * The currently stored weather report.
   */
  weather: IWeatherResponse | null;
}

const useWeather = (): IUseWeather => {
  const [weather, setWeather] = React.useState<IWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const weatherApi: IUseWeatherApi = useWeatherApi();

  const fetchWeather = async (zipCode: string): Promise<void> => {
    setIsLoading(true);
    await weatherApi
      .getHourlyWeatherForecastByZip(zipCode)
      .then((res): void => {
        setWeather((res as any).data);
      })
      .catch((err: Error): void => {
        console.error(err);
      });
    setIsLoading(false);
  };

  return {
    fetchWeather,
    isLoading: isLoading,
    weather,
  };
};

export default useWeather;
