import { IMapBoxForwardGeocodeResponse } from "./types";
import { ILatLongPair } from "../types";

const MAPBOX_API_ENDPOINT = "https://api.mapbox.com/geocoding/v5/mapbox.places";

/**
 * Extract the latitude and longitude from the mapbox API response.
 *
 * @param mapBoxResponse Response from mapbox API.
 * @returns a pair of latitude and longitude or undefined.
 */
export const extractCoordinatesMapbox = (mapBoxResponse: IMapBoxForwardGeocodeResponse): ILatLongPair | undefined => {
  try {
    return {
      latitude: mapBoxResponse.features[0].geometry.coordinates[1],
      longitude: mapBoxResponse.features[0].geometry.coordinates[0],
    };
  } catch (e) {
    return undefined;
  }
};

/**
 * Generate an endpoint to make a request to to get lat/long for a zip code.
 *
 * @param zipCode The zip code we want to request
 * @returns Endpoint for mapbox API.
 */
export const makeApiEndpointMapbox = (zipCode: string) => {
  return `${MAPBOX_API_ENDPOINT}/${zipCode}.json?country=US&access_token=${process.env.MAPBOX_TOKEN}`;
};
