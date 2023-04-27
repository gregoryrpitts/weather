import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import MadeBy from "components/MadeBy";

const StickyFooter: React.FunctionComponent = (): React.ReactElement => {
  return (
    <Box
      component={"footer"}
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth={"sm"}>
        <MadeBy />
      </Container>
    </Box>
  );
};

export default StickyFooter;
