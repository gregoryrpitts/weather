import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export enum ETypographyClasses {
  text = `text`,
  link = "link",
}

const StyledTypography = styled(Typography)<{ theme?: Theme }>(({ theme }) => ({
  [`&.${ETypographyClasses.text}`]: {
    color: theme.palette.text.secondary,
  },
  [`&.${ETypographyClasses.link}`]: {
    cursor: "pointer",
  },
}));

export default StyledTypography;
