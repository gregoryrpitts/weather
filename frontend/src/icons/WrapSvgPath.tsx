import React from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";
import SvgIcon from "@mui/material/SvgIcon";

const wrapSvgPath = (path: React.ReactElement, viewBox = "0 0 100 100") => {
  // eslint-disable-next-line react/display-name
  return (props: SvgIconProps): React.ReactElement => {
    return (
      <SvgIcon {...props} viewBox={viewBox}>
        {path}
      </SvgIcon>
    );
  };
};

export default wrapSvgPath;
