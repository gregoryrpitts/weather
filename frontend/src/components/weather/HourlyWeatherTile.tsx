import React from "react";
import { DateTime } from "luxon";

import Grid from "@mui/material/Grid";

import { useWeatherProvider } from "providers/WeatherProvider";
import { EUnitOfMeasure } from "providers/WeatherProvider";
import { IWeatherContext } from "providers/WeatherProvider";

import { IWeatherByHour } from "types/weather";

interface IHourlyWeatherTileProps {
  /**
   * A single hour of weather data.
   */
  weather: IWeatherByHour;
}

/**
 * Simple function to convery F to C
 *
 * @param fTemp Temperature in Farenheit
 * @returns fTemp in degrees Celcius
 */
const toCelcius = (fTemp: number): number => {
  return Math.round((((fTemp - 32) * 5) / 9) * 10) / 10;
};

/**
 * Component to show a single row of weather data.
 *
 * @param weather  A single hour of weather data.
 * @returns
 */
const HourlyWeatherTile: React.FunctionComponent<IHourlyWeatherTileProps> = ({ weather }) => {
  const weatherProvider: IWeatherContext = useWeatherProvider();
  const startTime = DateTime.fromISO(weather.startTime, { setZone: true });

  return (
    <Grid container direction={"row"} spacing={2} alignItems={"flex-start"} justifyContent={"flex-start"}>
      <Grid item xs={1}>
        <img src={weather.icon.replace(/,[0-9]*/, "")} alt={weather.shortForecast} style={{ borderRadius: "50px" }} />
      </Grid>
      <Grid item xs={2}>
        {startTime.toFormat("h:mm a")}
      </Grid>
      <Grid item xs={1}>
        {weatherProvider.unit === EUnitOfMeasure.FARENHEIT ? `${weather.temperature}°` : `${toCelcius(weather.temperature)}°`}
      </Grid>
      <Grid item xs={6}>
        {weather.shortForecast}
      </Grid>
      <Grid item xs={2}>
        {`${weather.windSpeed} ${weather.windDirection}`}
      </Grid>
    </Grid>
  );
};

export default HourlyWeatherTile;
