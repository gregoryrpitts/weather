import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Search from "@mui/icons-material/Search";
import Toolbar from "@mui/material/Toolbar";

import MainContainer from "components/layout/MainContainer";
import StickyFooter from "components/layout/StickyFooter";

import STRINGS from "constants/strings";

import Input from "widgets/Input";
import { EInputClasses } from "widgets/Input";

import Typography from "widgets/Typography";
import { ETypographyClasses } from "widgets/Typography";

interface INavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FunctionComponent<INavbarProps> = ({ children }) => {
  return (
    <React.Fragment>
      <Box sx={{ display: "flex" }}>
        <AppBar position={"absolute"}>
          <Toolbar>
            <Typography className={ETypographyClasses.link} variant={"h6"} sx={{ flexGrow: 1 }}>
              {"Weather"}
            </Typography>
            <Input
              autoComplete="off"
              className={EInputClasses.search}
              disableUnderline
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="search for weather by zip" edge="end">
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
              placeholder={STRINGS.SEARCH_BY_ZIP}
              type={"text"}
            />
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
