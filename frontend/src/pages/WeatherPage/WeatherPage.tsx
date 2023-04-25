import React from "react";
import clsx from "clsx";
import Grid from "@mui/material/Grid";

import Container from "@mui/material/Container";

import { WeatherReport } from "components/weather";
import WeatherZipCodeSearch from "components/weather/WeatherZipCodeSearch";

import STRINGS from "constants/strings";
import { StyledSunIcon } from "icons";
import { EIconClasses } from "icons";

import { IUseWeather } from "services/weather";
import useWeather from "services/weather";

import Typography from "widgets/Typography";

import "./styles.css";

const WeatherPage: React.FunctionComponent = () => {
  const weatherHook: IUseWeather = useWeather();

  const handleOnSearch = async (zipCode: string): Promise<void> => {
    await weatherHook.fetchWeather(zipCode);
  };

  return (
    <Container maxWidth={"md"}>
      <Grid container alignItems={"center"} justifyContent={"center"} direction={"column"} flexGrow={1} spacing={1}>
        {!weatherHook.weather ? (
          <Grid item>
            <StyledSunIcon className={clsx(EIconClasses.title, "App-logo")} />
          </Grid>
        ) : (
          <WeatherReport weather={weatherHook.weather || []} />
        )}
        <Grid item>
          <Typography variant={"body1"}>{STRINGS.WELCOME_MESSAGE}</Typography>
        </Grid>
        <Grid item>
          <WeatherZipCodeSearch error={false} loading={weatherHook.isLoading} onSearch={handleOnSearch} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default WeatherPage;
//
