import React from "react";
import clsx from "clsx";
import Grid from "@mui/material/Grid";

import Container from "@mui/material/Container";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

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
  const [alignment, setAlignment] = React.useState<string | null>("left");

  const handleOnSearch = async (zipCode: string): Promise<void> => {
    await weatherHook.fetchWeather(zipCode);
  };

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

  return (
    <Container maxWidth={"md"}>
      <Grid container alignItems={"center"} justifyContent={"center"} direction={"column"} flexGrow={1} spacing={1}>
        {!weatherHook.weather ? (
          <Grid item>
            <StyledSunIcon className={clsx(EIconClasses.title, "App-logo")} />
            <Typography variant={"body1"}>{STRINGS.WELCOME_MESSAGE}</Typography>
            <WeatherZipCodeSearch error={false} loading={weatherHook.isLoading} onSearch={handleOnSearch} />
          </Grid>
        ) : (
          <Grid item style={{ width: "100%" }}>
            <Grid container direction={"row"}>
              <Grid item>
                <Typography variant={"h4"}>{`${STRINGS.WEATHER_REPORT_TITLE}`}</Typography>
              </Grid>
              <Grid item xs />
              <Grid item>
                <ToggleButtonGroup value={alignment} exclusive onChange={handleAlignment} aria-label="text alignment">
                  <ToggleButton value="left" aria-label="left aligned">
                    <Typography variant={"h6"}>{"°F"}</Typography>
                  </ToggleButton>
                  <ToggleButton value="center" aria-label="centered">
                    <Typography variant={"h6"}>{"°C"}</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
            <WeatherReport weather={weatherHook.weather || []} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default WeatherPage;
//
