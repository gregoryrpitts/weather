import React from "react";
import clsx from "clsx";
import Grid from "@mui/material/Grid";

import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";

import { WeatherReport } from "components/weather";
import { UnitToggle } from "components/layout";
import WeatherZipCodeSearch from "components/weather/WeatherZipCodeSearch";

import STRINGS from "constants/strings";
import { StyledSunIcon } from "icons";
import { EIconClasses } from "icons";
import { StyledShareIcon } from "icons";

import { useWeatherProvider } from "providers/WeatherProvider";
import { IWeatherContext } from "providers/WeatherProvider";

import Typography from "widgets/Typography";

import "./styles.css";

const WeatherPage: React.FunctionComponent = () => {
  const theme: Theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const weatherProvider: IWeatherContext = useWeatherProvider();

  return (
    <Container maxWidth={"md"}>
      <Grid container alignItems={"center"} justifyContent={"center"} direction={"column"} flexGrow={1} spacing={1}>
        {!weatherProvider.weather && (
          <Grid item>
            <Grid container direction={"column"} alignItems={"center"} justifyContent={"center"} spacing={2}>
              <Grid item>
                <StyledSunIcon className={clsx(EIconClasses.title, "App-logo")} />
              </Grid>
              <Grid item>
                <Typography variant={"h6"}>{STRINGS.WELCOME_MESSAGE}</Typography>
              </Grid>
              <Grid item>
                <WeatherZipCodeSearch />
              </Grid>
            </Grid>
          </Grid>
        )}
        {weatherProvider.weather && (
          <Grid item style={{ width: "100%" }}>
            <Grid container direction={"row"} alignItems={"center"} spacing={1}>
              {matches && (
                <Grid item>
                  <Typography variant={"h4"}>{`${STRINGS.WEATHER_REPORT_TITLE} ${
                    weatherProvider.zip && "(" + weatherProvider.zip + ")"
                  }`}</Typography>
                </Grid>
              )}
              <Grid item xs />
              <Grid item>
                <UnitToggle />
              </Grid>
              <Grid item xs={1}>
                <StyledShareIcon className={EIconClasses.header} />
              </Grid>
            </Grid>
            <WeatherReport />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default WeatherPage;
