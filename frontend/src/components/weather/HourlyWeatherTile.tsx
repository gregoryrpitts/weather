import React from "react";
import clsx from "clsx";
import { DateTime } from "luxon";

import Grid from "@mui/material/Grid";

import { StyledWindIcon } from "icons";
import { EIconClasses } from "icons";

import { useWeatherProvider } from "providers/WeatherProvider";
import { EUnitOfMeasure } from "providers/WeatherProvider";
import { IWeatherContext } from "providers/WeatherProvider";

import { IWeatherByHour } from "types/weather";

import Typography from "widgets/Typography";

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
    <Grid container direction={"row"} spacing={2} alignItems={"center"} justifyContent={"flex-start"}>
      <Grid item xs={2}>
        <Typography variant={"body1"}> {startTime.toFormat("h:mm a")}</Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography variant={"body1"}>
          {weatherProvider.unit === EUnitOfMeasure.FARENHEIT ? `${weather.temperature}°` : `${toCelcius(weather.temperature)}°`}
        </Typography>
      </Grid>
      <Grid item xs={7}>
        <Grid container direction={"row"} spacing={1} alignItems={"center"} justifyContent={"flex-start"}>
          <Grid item>
            <img src={weather.icon.replace(/,[0-9]*/, "")} alt={weather.shortForecast} style={{ borderRadius: "50px" }} />
          </Grid>
          <Grid item>
            <Typography variant={"body1"}>{weather.shortForecast}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Typography variant={"body1"}>
          <span>
            <StyledWindIcon className={clsx([EIconClasses.wind, EIconClasses.icon])} />
          </span>
          <span>{`${weather.windSpeed} ${weather.windDirection}`}</span>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default HourlyWeatherTile;
