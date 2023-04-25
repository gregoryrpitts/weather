import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";
import Input from "@mui/material/Input";

export enum EInputClasses {
  search = `search`,
}

const StyledInputField = styled(Input)<{ theme?: Theme }>(({ theme }) => ({
  [`&.${EInputClasses.search}`]: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default StyledInputField;
