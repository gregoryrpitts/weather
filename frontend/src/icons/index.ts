import { styled } from "@mui/material/styles";

import { iconColor } from "constants/colors";

import GithubIcon from "icons/GithubIcon";
import SunIcon from "icons/SunIcon";

export enum EIconClasses {
  icon = `icon`,
  title = "title",
}

const iconClasses = {
  [`&.${EIconClasses.icon}`]: {
    fill: iconColor,
  },
  [`&.${EIconClasses.title}`]: {
    fill: iconColor,
    fontSize: "35vmin",
  },
};

export const StyledSunIcon = styled(SunIcon)<Record<string, unknown>>(() => iconClasses);

export const StyledGithubIcon = styled(GithubIcon)<Record<string, unknown>>(() => iconClasses);
