import React from "react";

import { IUseWeatherApi } from "services/api/weatherApi";
import useWeatherApi from "services/api/weatherApi";
import { IWeatherResponse } from "types/weather";

export interface IUseWeather {
  /**
   * For testing purposes, allow caller to clear.
   *
   * @returns Void
   */
  clear: () => void;
  /**
   * Fetch weather for a Zip code.
   *
   * @param zipCode The 5 digit zip code to fetch weather for.
   * @returns A promise that resolves when the weather has been fetched.
   */
  fetchWeather: (zipCode: string) => Promise<boolean>;
  /**
   * Whether or not the weather is currently being fetched.
   */
  isLoading: boolean;
  /**
   * The currently stored weather report.
   */
  weather: IWeatherResponse | null;
  /**
   * last successfully searched zip
   */
  zip: string;
}

const useWeather = (): IUseWeather => {
  const [zip, setZip] = React.useState<string>("");
  const [weather, setWeather] = React.useState<IWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const weatherApi: IUseWeatherApi = useWeatherApi();

  const fetchWeather = async (zipCode: string): Promise<boolean> => {
    setIsLoading(true);
    const success = await weatherApi
      .getHourlyWeatherForecastByZip(zipCode)
      .then((res): boolean => {
        setWeather((res as any).data);
        console.log("pass");
        setZip(zipCode);
        return true;
      })
      .catch((_err: Error): boolean => {
        console.log("fail");
        // TODO: Log error to some external service for debugging (maybe)
        setZip("");
        setWeather(null);
        return false;
      });
    setIsLoading(false);
    return success;
  };

  const handleClear = (): void => {
    setWeather(null);
    setZip("");
  };

  return {
    clear: handleClear,
    fetchWeather,
    isLoading: isLoading,
    weather,
    zip: zip,
  };
};

export default useWeather;
