import * as React from "react";

import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

import { StyledGithubIcon } from "icons";
import { EIconClasses } from "icons";

import Typography from "widgets/Typography";
import { ETypographyClasses } from "widgets/Typography";

const MadeBy: React.FunctionComponent = (): React.ReactElement => {
  return (
    <Grid container direction={"row"} spacing={1} justifyContent={"center"} alignContent={"center"}>
      <Grid item>
        <StyledGithubIcon className={EIconClasses.icon} />
      </Grid>
      <Grid item>
        <Typography className={ETypographyClasses.text}>
          {"Made by "}
          <Link href={"https://www.linkedin.com/in/gregorypitts/"}>{"Gregory Pitts"}</Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default MadeBy;
