import axios, { AxiosResponse } from "axios";
import { ServerResponse } from "http";
import * as dotenv from "dotenv";

import { BAD_REQUEST_MESSAGE, INTERNAL_SERVER_ERROR_MESSAGE } from "../constants";
import { TServerRequest, ILatLongPair } from "../types";

import { extractZip } from "./helpers";
import { isUrlGood } from "./helpers";
import { pruneData } from "./helpers";

import { extractCoordinatesMapbox } from "../mapbox/helpers";
import { IMapBoxForwardGeocodeResponse } from "../mapbox/types";
import { makeApiEndpointMapbox } from "../mapbox/helpers";

import { getForecastOfficeInfo } from "../nws/helpers";
import { makeNwsForecastPointEndpoint } from "../nws/helpers";
import { makeNwsPointEndpoint } from "../nws/helpers";
import { validateForcastInformation } from "../nws/helpers";
import { IForecastResponse } from "../nws/types";
import { IGridPointData } from "../nws/types";
import { IPointEndpointResponse } from "../nws/types";

// Confifgure local env variables to store mapbox token.
dotenv.config();

const responseHeaders = { "Content-Type": "text/html" };

const serverFunction = async (req: TServerRequest, res: ServerResponse): Promise<void> => {
  if (!isUrlGood(req.url)) {
    res.writeHead(404, BAD_REQUEST_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // Hit the geolocation API to derive the latitude/longitude from the zip code.
  // Caching this information could be a point of improvement.
  const mapBoxResponse: AxiosResponse<IMapBoxForwardGeocodeResponse> = await axios.get(makeApiEndpointMapbox(extractZip(req.url)));

  // If the geocode fails, return the user a 500 error message.
  // TODO: more specific information about error logging can be logged to internal service, i.e. Datadog.
  if (mapBoxResponse.status !== 200) {
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // Parsing external data, use a try catch in case the 3rd party changes their API signature.
  const latLongPair: ILatLongPair | undefined = extractCoordinatesMapbox(mapBoxResponse.data);
  if (!latLongPair) {
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // We need to get information about the Forecast Station in order to get the actual forecast.
  const nwsGetPointResponse: AxiosResponse<IPointEndpointResponse> = await axios.get(makeNwsPointEndpoint(latLongPair));
  if (nwsGetPointResponse.status !== 200) {
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // Parse the external data with a helper function.
  const gridPointData: IGridPointData = getForecastOfficeInfo(nwsGetPointResponse.data);
  if (!gridPointData) {
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // Finally we can get the actual forecast.
  const nwsForecastResponse: AxiosResponse<IForecastResponse> = await axios.get(makeNwsForecastPointEndpoint(gridPointData));
  if (nwsForecastResponse.status !== 200) {
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // One more validation check to make sure we have the data we need.
  if (!validateForcastInformation(nwsForecastResponse.data)) {
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // We are home free. Write the relevant response and return.
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(JSON.stringify(pruneData(nwsForecastResponse.data)));
};

export default serverFunction;
