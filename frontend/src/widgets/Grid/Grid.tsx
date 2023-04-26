import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material/styles";

import Grid from "@mui/material/Grid";

export enum EGridClasses {
  alternate = `alternate`,
  outlined = `outlined`,
}

const StyledGrid = styled(Grid)<{ theme?: Theme }>(({ theme }) => ({
  [`&.${EGridClasses.outlined}`]: {
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  [`&.${EGridClasses.alternate}`]: {
    backgroundColor: theme.palette.grey[200],
  },
}));

export default StyledGrid;
