import { describe, expect, test } from "@jest/globals";

import { getForecastOfficeInfo } from "./helpers";
import { makeNwsPointEndpoint } from "./helpers";
import { makeNwsForecastPointEndpoint } from "./helpers";

describe("test nws helper functions", () => {
  test("Testing makeNwsPointEndpoint helper", () => {
    expect(makeNwsPointEndpoint({ latitude: 1, longitude: 2 })).toEqual(expect.stringContaining("/points/1,2"));
  });
  test("Testing makeNwsForecastPointEndpoint helper", () => {
    expect(makeNwsForecastPointEndpoint({ cwa: "TOP", gridX: 1, gridY: 2 })).toEqual(expect.stringContaining("/TOP/1,2/"));
  });
  test("Testing getForecastOfficeId helper", () => {
    expect(getForecastOfficeInfo({ properties: { cwa: "test", gridX: 1, gridY: 2 } })).toStrictEqual({
      cwa: "test",
      gridX: 1,
      gridY: 2,
    });
    expect(getForecastOfficeInfo(undefined)).toBe(undefined);
  });
});
