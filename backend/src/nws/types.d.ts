export interface IPointEndpointResponse {
  properties: IGridPointData;
}

export interface IGridPointData {
  cwa: string;
  gridX: number;
  gridY: number;
}

export interface IForecastPeriod {
  endTime: string;
  icon: string;
  shortForecast: string;
  startTime: string;
  temperature: number;
  windDirection: string;
  windSpeed: string;
}

export interface IForecastResponse {
  properties: {
    forecastGenerator: string;
    generatedAt: string;
    periods: IForecastPeriod[];
    units: string;
    updated: string;
    updateTime: string;
    validTimes: string;
  };
}

export interface IForecastHourlyResponse {
  /**
   * The end time of this period, in ISO8601 format.
   */
  endTime: string;
  /**
   * A link to the weather icon for the forecast.
   */
  icon: string;
  /**
   * A short description of the conditions during this part of the day.
   */
  shortForecast: string;
  /**
   * The start time of this period, in ISO8601 format.
   */
  startTime: string;
  /**
   * The time zone offset of the START TIME, in +/-HH:MM format.
   */
  startTimeZone: string;
  /**
   * The temperature during this part of the day in Fahrenheit.
   */
  temperature: number;
  /**
   * The wind speed during this part of the day.
   */
  windSpeed: string;
  /**
   * The wind direction during this part of the day.
   */
  windDirection: string;
}
