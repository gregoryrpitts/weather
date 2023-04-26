import React from "react";

import { Layout } from "components/layout";
import WeatherProvider from "providers/WeatherProvider";

const App: React.FunctionComponent = (): React.ReactElement => {
  return (
    <WeatherProvider>
      <Layout />
    </WeatherProvider>
  );
};

export default App;
