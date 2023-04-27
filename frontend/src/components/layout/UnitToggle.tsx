import React from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useWeatherProvider } from "providers/WeatherProvider";
import { EUnitOfMeasure } from "providers/WeatherProvider";
import { IWeatherContext } from "providers/WeatherProvider";

import Typography from "widgets/Typography";

const UnitToggle: React.FunctionComponent = (): React.ReactElement => {
  const weatherProvider: IWeatherContext = useWeatherProvider();

  const handleAlignment = (_event: React.MouseEvent<HTMLElement>, newAlignment: EUnitOfMeasure) => {
    weatherProvider.setUnit && weatherProvider.setUnit(newAlignment);
  };

  return (
    <ToggleButtonGroup value={weatherProvider.unit} exclusive onChange={handleAlignment} aria-label="text alignment" size="medium">
      <ToggleButton value={EUnitOfMeasure.FARENHEIT} aria-label="left aligned">
        <Typography variant={"h6"}>{"°F"}</Typography>
      </ToggleButton>
      <ToggleButton value={EUnitOfMeasure.CELSIUS} aria-label="centered">
        <Typography variant={"h6"}>{"°C"}</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default UnitToggle;
