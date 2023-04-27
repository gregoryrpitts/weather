import { styled } from "@mui/material/styles";

import { iconColor } from "constants/colors";

import GithubIcon from "icons/GithubIcon";
import SunIcon from "icons/SunIcon";
import ShareIcon from "icons/ShareIcon";
import WindIcon from "icons/WindIcon";

export enum EIconClasses {
  header = "header",
  icon = `icon`,
  link = `link`,
  title = "title",
  wind = "wind",
}

const iconClasses = {
  [`&.${EIconClasses.icon}`]: {
    fill: iconColor,
  },
  [`&.${EIconClasses.wind}`]: {
    fill: "blue",
    verticalAlign: "bottom",
  },
  [`&.${EIconClasses.title}`]: {
    fill: iconColor,
    fontSize: "35vmin",
  },
  [`&.${EIconClasses.header}`]: {
    fill: "grey",
    fontSize: "2rem",
  },
  [`&.${EIconClasses.link}`]: {
    cursor: "pointer",
  },
};

export const StyledGithubIcon = styled(GithubIcon)<Record<string, unknown>>(() => iconClasses);
export const StyledShareIcon = styled(ShareIcon)<Record<string, unknown>>(() => iconClasses);
export const StyledSunIcon = styled(SunIcon)<Record<string, unknown>>(() => iconClasses);
export const StyledWindIcon = styled(WindIcon)<Record<string, unknown>>(() => iconClasses);
