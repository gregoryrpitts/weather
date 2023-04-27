import { AxiosError } from "axios";
import { AxiosResponse } from "axios";

import { IUseAxiosInstance } from "services/api/axiosInstance";
import { useAxiosInstance } from "services/api/axiosInstance";

import { IWeatherResponse } from "types/weather";

/**
 * Make the URL to request weather from.
 *
 * @param zipCode The zip code to fetch weather for.
 * @returns The endpoint string.
 */
const getHourlyWeatherForecastByZipEndpointUrl = (zipCode: string): string => {
  return `/weather?zip=${zipCode}`;
};

export interface IUseWeatherApi {
  /**
   * Fetches the hourly weather forecast for a given zip code.
   *
   * @param zip Zip Code of the location to fetch weather for.
   */
  getHourlyWeatherForecastByZip: (zipCode: string) => Promise<IWeatherResponse>;
}

const useWeatherApi = (): IUseWeatherApi => {
  const axiosHook: IUseAxiosInstance = useAxiosInstance();

  const getHourlyWeatherForecastByZip = (zipCode: string): Promise<IWeatherResponse> => {
    return axiosHook.get<IWeatherResponse, AxiosResponse<IWeatherResponse>, AxiosError>(getHourlyWeatherForecastByZipEndpointUrl(zipCode), null);
  };

  return {
    getHourlyWeatherForecastByZip,
  };
};

export default useWeatherApi;
