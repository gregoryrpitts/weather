import React from "react";

import Box from "@mui/material/Box";

interface IPageLayoutProps {
  children: React.ReactNode;
}

const PageWrapper: React.FunctionComponent<IPageLayoutProps> = ({ children }): React.ReactElement => {
  return <Box sx={{ margin: 1, flexGrow: 1 }}>{children}</Box>;
};

export default PageWrapper;
