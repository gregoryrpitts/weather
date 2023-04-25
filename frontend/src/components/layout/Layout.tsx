import * as React from "react";

import { Navbar } from "components/layout";
import { PageWrapper } from "components/layout";

import WeatherPage from "pages/WeatherPage";

const Layout: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <Navbar>
        <PageWrapper>
          <WeatherPage />
        </PageWrapper>
      </Navbar>
    </React.Fragment>
  );
};

export default Layout;
