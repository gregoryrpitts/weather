import React from "react";
import clsx from "clsx";
import Grid from "@mui/material/Grid";

import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { WeatherReport } from "components/weather";
import WeatherZipCodeSearch from "components/weather/WeatherZipCodeSearch";

import STRINGS from "constants/strings";
import { StyledSunIcon } from "icons";
import { EIconClasses } from "icons";

import { useWeatherProvider } from "providers/WeatherProvider";
import { EUnitOfMeasure } from "providers/WeatherProvider";
import { IWeatherContext } from "providers/WeatherProvider";

import Typography from "widgets/Typography";

import "./styles.css";

const UnitToggle: React.FunctionComponent = (): React.ReactElement => {
  const weatherProvider: IWeatherContext = useWeatherProvider();

  const handleAlignment = (_event: React.MouseEvent<HTMLElement>, newAlignment: EUnitOfMeasure) => {
    weatherProvider.setUnit && weatherProvider.setUnit(newAlignment);
  };

  return (
    <ToggleButtonGroup value={weatherProvider.unit} exclusive onChange={handleAlignment} aria-label="text alignment">
      <ToggleButton value={EUnitOfMeasure.FARENHEIT} aria-label="left aligned">
        <Typography variant={"h6"}>{"°F"}</Typography>
      </ToggleButton>
      <ToggleButton value={EUnitOfMeasure.CELSIUS} aria-label="centered">
        <Typography variant={"h6"}>{"°C"}</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

const WeatherReportTitle = () => {
  const weatherProvider: IWeatherContext = useWeatherProvider();
  return <Typography variant={"h4"}>{`${STRINGS.WEATHER_REPORT_TITLE} ${weatherProvider.zip && "(" + weatherProvider.zip + ")"}`}</Typography>;
};

const WeatherPage: React.FunctionComponent = () => {
  const weatherProvider: IWeatherContext = useWeatherProvider();

  if (weatherProvider.isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px" }}>
        <CircularProgress disableShrink />
      </div>
    );
  }

  return (
    <Container maxWidth={"md"}>
      <Grid container alignItems={"center"} justifyContent={"center"} direction={"column"} flexGrow={1} spacing={1}>
        {!weatherProvider.weather ? (
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
        ) : (
          <Grid item style={{ width: "100%" }}>
            <Grid container direction={"row"}>
              <Grid item>
                <WeatherReportTitle />
              </Grid>
              <Grid item xs />
              <Grid item>
                <UnitToggle />
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
//
