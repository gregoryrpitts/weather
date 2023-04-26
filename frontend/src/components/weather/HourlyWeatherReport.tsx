import * as React from "react";
import { DateTime } from "luxon";
import clsx from "clsx";

import HourlyWeatherTile from "components/weather/HourlyWeatherTile";

import { useWeatherProvider } from "providers/WeatherProvider";
import { IWeatherContext } from "providers/WeatherProvider";

import { IWeatherByHour } from "types/weather";

import Grid from "widgets/Grid";
import { EGridClasses } from "widgets/Grid";
import Typography from "widgets/Typography";

const TITLE_ROW_FORMAT = "LLL dd, yyyy";
const COMPARE_FORMAT = "m:dd";
const ROLLOVER_FORMAT = "h:mm a";
const ROLLOVER_TIME = "12:00 AM";

/**
 * The Date to display in the hourly forecast.
 */
interface IDateRowProps {
  date: DateTime;
}

/**
 * Display a row to indicate the start of a new day in the hourly forecast.
 *
 * @param date
 * @returns
 */
const DateRow: React.FunctionComponent<IDateRowProps> = ({ date }) => {
  return (
    <Grid item sx={{ mt: 1, mb: 1 }}>
      <Typography variant={"h5"}>{date.toFormat(TITLE_ROW_FORMAT)}</Typography>
    </Grid>
  );
};

/**
 * Check if this DateTime is a rollover hour compared to reference date.
 *
 * @param startDayCompareString Comprision string to check if the date we are processing is the same as the start date
 * @param currentDate The date we are processing.
 * @returns True if this is the first hour in a new day (relative to startDayCompareString), False otherwise.
 */
const isRolloverHour = (startDayCompareString: string, currentDate: DateTime): boolean => {
  return startDayCompareString !== currentDate.toFormat(COMPARE_FORMAT) && currentDate.toFormat(ROLLOVER_FORMAT) === ROLLOVER_TIME;
};

/**
 *
 * @param weather The hourly weather data.
 * @returns
 */
const HourlyWeatherReport: React.FunctionComponent = (): React.ReactElement | null => {
  const weatherProvider: IWeatherContext = useWeatherProvider();

  if (!weatherProvider.weather || weatherProvider.weather.length === 0 || !weatherProvider.weather.at(0)) {
    return null;
  }

  const titleDateTime = DateTime.fromISO(weatherProvider.weather[0].startTime, { setZone: true });
  const comparisionString = titleDateTime.toFormat(COMPARE_FORMAT);

  return (
    <Grid container direction={"column"} spacing={1}>
      <DateRow date={titleDateTime} />
      {weatherProvider.weather.map((hourlyWeather: IWeatherByHour, index: number) => {
        const hourlyStartTime = DateTime.fromISO(hourlyWeather.startTime, { setZone: true });
        return (
          <React.Fragment>
            {isRolloverHour(comparisionString, hourlyStartTime) && <DateRow date={hourlyStartTime} />}
            <Grid item={true} className={clsx({ [EGridClasses.outlined]: true, [EGridClasses.alternate]: index % 2 })}>
              <HourlyWeatherTile weather={hourlyWeather} />
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

export default HourlyWeatherReport;
