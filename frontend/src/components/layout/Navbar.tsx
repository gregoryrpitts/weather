import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import MainContainer from "components/layout/MainContainer";
import StickyFooter from "components/layout/StickyFooter";
import WeatherZipCodeSearch from "components/weather/WeatherZipCodeSearch";

import STRINGS from "constants/strings";

import { useWeatherProvider } from "providers/WeatherProvider";
import { IWeatherContext } from "providers/WeatherProvider";

import Typography from "widgets/Typography";
import { ETypographyClasses } from "widgets/Typography";

interface INavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FunctionComponent<INavbarProps> = ({ children }) => {
  const weatherProvider: IWeatherContext = useWeatherProvider();

  const handleClear = () => {
    weatherProvider.clear && weatherProvider.clear();
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex" }}>
        <AppBar position={"absolute"}>
          <Toolbar>
            <Typography className={ETypographyClasses.link} variant={"h6"} sx={{ flexGrow: 1 }} onClick={handleClear}>
              {STRINGS.APP_TITLE}
            </Typography>
            <WeatherZipCodeSearch />
          </Toolbar>
        </AppBar>

        <MainContainer>
          <Toolbar />
          {children}
          <StickyFooter />
        </MainContainer>
      </Box>
    </React.Fragment>
  );
};

export default Navbar;
