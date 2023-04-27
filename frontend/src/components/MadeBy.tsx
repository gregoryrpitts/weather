import * as React from "react";
import clsx from "clsx";

import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

import { StyledGithubIcon } from "icons";
import { EIconClasses } from "icons";

import Typography from "widgets/Typography";
import { ETypographyClasses } from "widgets/Typography";

const githubLink = "https://github.com/gregoryrpitts";

const MadeBy: React.FunctionComponent = (): React.ReactElement => {
  const gitHubClicked = () => {
    window.open(githubLink, "_blank");
  };

  return (
    <Grid container direction={"row"} spacing={1} justifyContent={"center"} alignContent={"center"}>
      <Grid item>
        <StyledGithubIcon className={clsx([EIconClasses.icon, EIconClasses.link])} onClick={gitHubClicked} />
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
