import axios, { AxiosResponse } from "axios";
import { ServerResponse } from "http";
import * as dotenv from "dotenv";

import { BAD_REQUEST_MESSAGE, INTERNAL_SERVER_ERROR_MESSAGE, BAD_REQUEST_MESSAGE_BAD_ZIP } from "../constants";
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
const nws_headers = {
  headers: {
    // Weather API requests User-Agent headers to be set.
    "User-Agent": `gregoryrpitts@crossnokaye`,
  },
};

const serverFunction = async (req: TServerRequest, res: ServerResponse): Promise<void> => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Max-Age", 2592000); // 30 days

  if (!isUrlGood(req.url)) {
    console.log("Failing because URL is no good.");
    res.writeHead(404, BAD_REQUEST_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // Hit the geolocation API to derive the latitude/longitude from the zip code.
  // Caching this information could be a point of improvement.
  const mapBoxResponse: AxiosResponse<IMapBoxForwardGeocodeResponse> = await axios.get(makeApiEndpointMapbox(extractZip(req.url)));

  // If the geocode fails, return the user a 500 error message.
  if (mapBoxResponse.status !== 200) {
    // TODO: more specific information about error logging can be logged to internal service, i.e. Datadog.
    console.log("Failing because bad request to Map Box URL.");
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // Parsing external data, use a try catch in case the 3rd party changes their API signature.
  const latLongPair: ILatLongPair | undefined = extractCoordinatesMapbox(mapBoxResponse.data);
  if (!latLongPair) {
    res.writeHead(404, BAD_REQUEST_MESSAGE_BAD_ZIP, responseHeaders);
    res.end();
    return;
  }
  console.log(mapBoxResponse.data);

  // We need to get information about the Forecast Station in order to get the actual forecast.
  const nwsGetPointResponse: AxiosResponse<IPointEndpointResponse> = await axios.get(makeNwsPointEndpoint(latLongPair), nws_headers);
  if (nwsGetPointResponse.status !== 200) {
    console.log("Failing because failed first request to NWS.");
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // Parse the external data with a helper function.
  const gridPointData: IGridPointData = getForecastOfficeInfo(nwsGetPointResponse.data);
  if (!gridPointData) {
    console.log("Failing because return from NWS was bad.");
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // Finally we can get the actual forecast.
  const nwsForecastResponse: AxiosResponse<IForecastResponse> = await axios.get(makeNwsForecastPointEndpoint(gridPointData), nws_headers);
  // .catch((err: AxiosError) => {
  //   // TODO: Log this to our own internal server.
  //   console.log(err);
  //   return err;
  // });
  if (nwsForecastResponse.status !== 200 || !(nwsForecastResponse as AxiosResponse<IForecastResponse>).data) {
    console.log("Failing because second request to NWS.");
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // One more validation check to make sure we have the data we need.
  if (!validateForcastInformation((nwsForecastResponse as AxiosResponse<IForecastResponse>).data)) {
    console.log("Failing because erro validation before response.");
    res.writeHead(500, INTERNAL_SERVER_ERROR_MESSAGE, responseHeaders);
    res.end();
    return;
  }

  // We are home free. Write the relevant response and return.
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(JSON.stringify(pruneData((nwsForecastResponse as AxiosResponse<IForecastResponse>).data)));
};

export default serverFunction;
