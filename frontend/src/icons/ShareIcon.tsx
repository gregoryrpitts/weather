import React from "react";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import STRINGS from "constants/strings";

import wrapSvgPath from "icons/WrapSvgPath";

const TOOLTIP_DELAY = 1000;

const shareIconPath = (
  <g>
  <path d="m499.33 196h-74.668c-5.6016 0-9.332 3.7344-9.332 9.332 0 5.6016 3.7344 9.332 9.332 9.332h65.332v280h-280v-280l65.336 0.003907c5.6016 0 9.332-3.7344 9.332-9.332 0-5.6016-3.7344-9.332-9.332-9.332l-74.664-0.003906c-5.6016 0-9.332 3.7344-9.332 9.332v298.67c0 5.6016 3.7344 9.332 9.332 9.332h298.67c5.6016 0 9.332-3.7344 9.332-9.332v-298.67c0-5.5977-3.7344-9.332-9.3359-9.332z" stroke="black" strokeWidth="20"/>
  <path d="m282.8 156.8 57.867-57.867v255.73c0 5.6016 3.7344 9.332 9.332 9.332 5.6016 0 9.332-3.7344 9.332-9.332v-257.6l57.867 57.867c3.7344 3.7344 9.332 3.7344 13.066 0s3.7344-9.332 0-13.066l-74.668-74.668c-3.7344-3.7344-9.332-3.7344-13.066 0l-74.668 74.668c-3.7344 3.7344-3.7344 9.332 0 13.066 3.7383 3.7344 11.203 3.7344 14.938 1.8672z"stroke="black" strokeWidth="20"/>
 </g>
);
const Share = wrapSvgPath(shareIconPath, "0 0 700 700");

const ShareIcon = () => {
  const [tooltipOpen, setTooltipOpen] = React.useState<boolean>(false);

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.toString());
    setTooltipOpen(true);
    setTimeout(() => {
      setTooltipOpen(false);
    }, TOOLTIP_DELAY);
  };

  return (
    <Tooltip arrow open={tooltipOpen} title={STRINGS.COPIED} placement={"right-end"}>
      <IconButton aria-label="share weather" size={"large"} onClick={handleClick}>
        <Share />
      </IconButton>
    </Tooltip>
  );
};

export default ShareIcon;
