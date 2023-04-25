/**
 * @description This component is responsible for allowing the User to search for a Zip Code.
 */

import React from "react";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Search from "@mui/icons-material/Search";
import STRINGS from "constants/strings";
import Input from "widgets/Input";
import { EInputClasses } from "widgets/Input";

interface IWeatherZipCodeSearchProps {
  /**
   * @description Whether or not there was an error
   */
  error?: boolean;
  /**
   * @description The error message to display
   */
  errorMessage?: string;
  /**
   * @description Whether or not the component is loading
   */
  loading: boolean;
  /**
   * @description Callback for when the User wants to search for a Zip Code.
   *
   * @param zipCode The Zip Code to pass to the search callback.
   * @returns void
   */
  onSearch: (zipCode: string) => void;
}

const WeatherZipCodeSearch: React.FunctionComponent<IWeatherZipCodeSearchProps> = ({ error, errorMessage, loading, onSearch }) => {
  const [zipCode, setZipCode] = React.useState<number | string>("");
  const [localError, setLocalError] = React.useState<boolean>(false);

  const handleOnSearch = async () => {
    onSearch && onSearch(zipCode.toString(0));
  };

  const handleZipCodeChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
    setLocalError(false);
  };

  React.useEffect(() => {
    setLocalError(error || false);
  }, [error]);

  return (
    <Input
      autoComplete="off"
      className={EInputClasses.search}
      disableUnderline
      endAdornment={
        <InputAdornment position="end">
          <IconButton aria-label="search for weather by zip" disabled={loading} onClick={handleOnSearch} edge="end">
            <Search />
          </IconButton>
        </InputAdornment>
      }
      error={localError}
      onChange={handleZipCodeChanged}
      placeholder={STRINGS.SEARCH_BY_ZIP}
      type={"text"}
      value={zipCode}
    />
  );
};

export default WeatherZipCodeSearch;
