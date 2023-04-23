import { describe, expect, test } from "@jest/globals";
import { extractCoordinatesMapbox } from "./helpers";
import { makeApiEndpointMapbox } from "./helpers";

describe("test mapbox helper functions", () => {
  test("Test extracting lat/long coordinates from response", () => {
    expect(extractCoordinatesMapbox({ features: [{ geometry: { coordinates: [1, 2] } }] })).toEqual({ latitude: 2, longitude: 1 });
    expect(extractCoordinatesMapbox(undefined)).toBe(undefined);
  });
  test("Testing makeApiEndpointMapbox helper", () => {
    expect(makeApiEndpointMapbox("14609")).toEqual(expect.stringContaining("14609.json?country=US&access_token="));
  });
});
