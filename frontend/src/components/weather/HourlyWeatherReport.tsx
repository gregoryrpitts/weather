import * as React from "react";
import { DateTime } from "luxon";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import HourlyWeatherTile from "components/weather/HourlyWeatherTile";
import STRINGS from "constants/strings";
import { IWeatherByHour } from "types/weather";
import Typography from "widgets/Typography";

interface IWeatherReportProps {
  weather: IWeatherByHour[];
  zip?: string;
}

interface IDateRowProps {
  date: DateTime;
}

const TITLE_ROW_FORMAT = "LLL dd, yyyy";

const DateRow: React.FunctionComponent<IDateRowProps> = ({ date }) => {
  return (
    <Grid item>
      <Typography variant={"h5"}>{date.toFormat(TITLE_ROW_FORMAT)}</Typography>
    </Grid>
  );
};

const isRolloverHour = (comparisionString: string, currentDate: DateTime): boolean => {
  return comparisionString !== currentDate.toFormat("m:dd") && currentDate.toFormat("h:mm a") === "12:00 AM";
};

const HourlyWeatherReport: React.FunctionComponent<IWeatherReportProps> = ({ weather, zip = "" }): React.ReactElement | null => {
  if (!weather || weather.length === 0 || !weather.at(0)) {
    return null;
  }

  const titleDateTime = DateTime.fromISO(weather[0].startTime, { setZone: true });
  const comparisionString = titleDateTime.toFormat("m:dd");
  return (
    <Container maxWidth={"md"}>
      <Grid container direction={"row"} spacing={1}>
        <Grid item>
          <Grid container direction={"row"} spacing={1}>
            <Grid item xs={6}>
              <Typography variant={"h4"}>{`${STRINGS.WEATHER_REPORT_TITLE}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction={"column"} spacing={1}>
            <DateRow date={titleDateTime} />
            {weather.map((hourlyWeather: IWeatherByHour) => {
              const hourlyStartTime = DateTime.fromISO(hourlyWeather.startTime, { setZone: true });
              return (
                <React.Fragment>
                  {isRolloverHour(comparisionString, hourlyStartTime) && <DateRow date={hourlyStartTime} />}
                  <Grid item>
                    <HourlyWeatherTile weather={hourlyWeather} />
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HourlyWeatherReport;
