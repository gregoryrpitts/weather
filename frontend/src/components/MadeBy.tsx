import * as React from "react";
import clsx from "clsx";

import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

import STRINGS from "constants/strings";

import { StyledGithubIcon } from "icons";
import { EIconClasses } from "icons";

import Typography from "widgets/Typography";
import { ETypographyClasses } from "widgets/Typography";

const githubLink = "https://github.com/gregoryrpitts/weather";
const linkedInLink = "https://www.linkedin.com/in/gregorypitts/";
const authorName = "Gregory Pitts";

const MadeBy: React.FunctionComponent = (): React.ReactElement => {
  return (
    <Grid container direction={"row"} spacing={1} justifyContent={"center"} alignContent={"center"}>
      <Grid item>
        <Link href={githubLink} target="_blank">
          <StyledGithubIcon className={clsx([EIconClasses.icon, EIconClasses.link])} />
        </Link>
      </Grid>
      <Grid item>
        <Typography className={ETypographyClasses.text}>
          {STRINGS.MADE_BY} <Link href={linkedInLink}>{authorName}</Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default MadeBy;
