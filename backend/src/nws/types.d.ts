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
  temperatureUnit: string;
  windDirection: string;
  windSpeed: string;
}

export interface IForecastResponse {
  properties: {
    updated: string;
    units: string;
    forecastGenerator: string;
    generatedAt: string;
    updateTime: string;
    validTimes: string;
    periods: IForecastPeriod[];
  };
}
