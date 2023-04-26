import React from "react";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";

import { Layout } from "components/layout";
import WeatherProvider from "providers/WeatherProvider";

const App: React.FunctionComponent = (): React.ReactElement => {
  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <WeatherProvider>
          <Layout />
        </WeatherProvider>
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;
