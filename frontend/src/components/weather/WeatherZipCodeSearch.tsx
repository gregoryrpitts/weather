/**
 * @description This component is responsible for allowing the User to search for a Zip Code.
 */

import React from "react";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Search from "@mui/icons-material/Search";

import STRINGS from "constants/strings";

import { useWeatherProvider } from "providers/WeatherProvider";
import { IWeatherContext } from "providers/WeatherProvider";

import Input from "widgets/Input";
import { EInputClasses } from "widgets/Input";

const ZIP_REGEX = /^\d{5}$/;

const WeatherZipCodeSearch: React.FunctionComponent = () => {
  const weatherProvider: IWeatherContext = useWeatherProvider();

  const [zipCode, setZipCode] = React.useState<number | string>("");
  const [allowSearch, setAllowSearch] = React.useState<boolean>(false);

  const handleOnSearch = async () => {
    weatherProvider.setZip && weatherProvider.setZip(zipCode.toString());
  };

  const handleEnterPressed = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleOnSearch();
    }
  };

  const handleZipCodeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (ZIP_REGEX.test(e.target.value)) {
      setAllowSearch(true);
    } else {
      setAllowSearch(false);
    }

    setZipCode(e.target.value);
  };

  return (
    <Input
      autoComplete="off"
      className={EInputClasses.search}
      disabled={weatherProvider.isLoading}
      disableUnderline
      endAdornment={
        <InputAdornment position="end">
          <IconButton aria-label="search for weather by zip" disabled={weatherProvider.isLoading || !allowSearch} onClick={handleOnSearch} edge="end">
            <Search />
          </IconButton>
        </InputAdornment>
      }
      inputMode="numeric"
      onChange={handleZipCodeChanged}
      onKeyDown={handleEnterPressed}
      placeholder={STRINGS.SEARCH_BY_ZIP}
      type={"text"}
      value={zipCode}
    />
  );
};

export default WeatherZipCodeSearch;
