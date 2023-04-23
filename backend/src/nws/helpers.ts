import { IPointEndpointResponse } from "./types";
import { IGridPointData } from "./types";
import { IForecastResponse } from "./types";

import { ILatLongPair } from "../types";

const NWS_API_BASE_URL = "https://api.weather.gov";
export const NATIONAL_WEATHER_POINT_API_ENDPOINT = `${NWS_API_BASE_URL}/points`;
export const NATIONAL_WEATHER_FORECAST_API_ENDPOINT = `${NWS_API_BASE_URL}/gridpoints`;

/**
 * Get the forecast office ID from the NWS points API response.
 *
 * @param response Response from /points NWS API endpoint.
 * @returns Either the forecast office ID or undefined.
 */
export const getForecastOfficeInfo = (response: IPointEndpointResponse): IGridPointData | undefined => {
  try {
    return {
      cwa: response.properties.cwa,
      gridX: response.properties.gridX,
      gridY: response.properties.gridY,
    };
  } catch (e) {
    return undefined;
  }
};

/**
 * Get the endpoint to get the weather station ID for a given point.
 *
 * @param latLong Latitude/Longitude point
 * @returns An endpoint to get the forecast for a given point.
 */
export const makeNwsPointEndpoint = (latLong: ILatLongPair): string => {
  return `${NATIONAL_WEATHER_POINT_API_ENDPOINT}/${latLong.latitude},${latLong.longitude}`;
};

/**
 * Get the endpoint to get the weather station ID for a given point.
 *
 * @param latLong Latitude/Longitude point
 * @returns An endpoint to get the forecast for a given point.
 */
export const makeNwsForecastPointEndpoint = (gridPointData: IGridPointData): string => {
  return `${NATIONAL_WEATHER_FORECAST_API_ENDPOINT}/${gridPointData.cwa}/${gridPointData.gridX},${gridPointData.gridY}/forecast/hourly`;
};

/**
 * check to make sure we have data from forecast API.
 * 
 * @param forecastResponse The response data for Forecast API.
 * @returns True is valid, false if not.
 */
export const validateForcastInformation = (forecastResponse: IForecastResponse): boolean => {
  return !!forecastResponse.properties;
};
