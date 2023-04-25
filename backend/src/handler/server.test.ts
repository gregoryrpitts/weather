import axios from "axios";
import { EventEmitter } from "events";
import { describe, beforeEach, expect, test } from "@jest/globals";
import { ServerResponse } from "http";
import { createResponse, MockResponse } from "node-mocks-http";

import { BAD_REQUEST_MESSAGE, OK_MESSAGE, BAD_REQUEST_MESSAGE_BAD_ZIP, INTERNAL_SERVER_ERROR_MESSAGE } from "../constants";
import { URL_REGEX } from "../constants";

import { extractZip } from "./helpers";
import { isUrlGood } from "./helpers";

import serverFunction from "./handler";

const GOOD_REQUEST = "/weather?zip=14609";

// Mock our axios calls so we don't hit the real API during testing.
jest.mock("axios");

describe("Test generic helper functions", () => {
  test("Check Regex to filter url prefix", () => {
    expect(URL_REGEX.test("/weather?zip=12345")).toBe(true);
    expect(URL_REGEX.test("weather/12345")).toBe(false);
    expect(URL_REGEX.test("/weather12345")).toBe(false);
    expect(URL_REGEX.test("/zip/12345")).toBe(false);
  });
  test("Check number of digits in zip", () => {
    expect(URL_REGEX.test("/weather?zip=1234")).toBe(false);
    expect(URL_REGEX.test("/weather?zip=12345")).toBe(true);
    expect(URL_REGEX.test("/weather?zip=123556")).toBe(false);
  });
  test("Testing extract zip helper", () => {
    expect(extractZip(GOOD_REQUEST)).toBe("14609");
  });
  test("Testing isUrlGood helper", () => {
    expect(isUrlGood(GOOD_REQUEST)).toBe(true);
    expect(isUrlGood(GOOD_REQUEST + "3")).toBe(false);
  });
});

describe("Reverse Proxy test", () => {
  let res: MockResponse<ServerResponse>;
  const mockAxiosGetSpy = jest.spyOn(axios, "get");

  beforeEach(() => {
    res = createResponse({
      eventEmitter: EventEmitter,
    });
    mockAxiosGetSpy.mockClear();
  });

  test("Check 404 when bad request", () => {
    serverFunction({ url: "/bad" }, res);
    expect(res.statusCode).toBe(404);
    expect(res.statusMessage).toBe(BAD_REQUEST_MESSAGE);
  });

  test("Check reverse proxy returns 500 when MapBox API fails.", async () => {
    mockAxiosGetSpy.mockResolvedValue({
      status: 401,
      statusText: "Not Authorized - Invalid Token",
    });

    await serverFunction({ url: GOOD_REQUEST }, res);
    expect(res.statusCode).toBe(500);
    expect(res.statusMessage).toBe(INTERNAL_SERVER_ERROR_MESSAGE);
    expect(axios.get).toBeCalledTimes(1);
  });

  test("Check reverse proxy returns 500 when MapBox API signature changes.", async () => {
    mockAxiosGetSpy.mockResolvedValueOnce({
      status: 200,
      data: {
        features: [],
      },
    });

    await serverFunction({ url: GOOD_REQUEST }, res);
    expect(res.statusCode).toBe(404);
    expect(res.statusMessage).toBe(BAD_REQUEST_MESSAGE_BAD_ZIP);
    expect(axios.get).toBeCalledTimes(1);
  });

  test("Check reverse proxy returns 500 when MapBox API passed but NWS fails.", async () => {
    mockAxiosGetSpy
      .mockResolvedValueOnce({
        status: 200,
        data: {
          features: [
            {
              geometry: {
                coordinates: [1, 2],
              },
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        status: 401,
      });

    await serverFunction({ url: GOOD_REQUEST }, res);
    expect(res.statusCode).toBe(500);
    expect(res.statusMessage).toBe(INTERNAL_SERVER_ERROR_MESSAGE);
  });

  test("Check reverse proxy returns 500 when MapBox API passed but NWS returns bad data.", async () => {
    mockAxiosGetSpy
      .mockResolvedValueOnce({
        status: 200,
        data: {
          features: [
            {
              geometry: {
                coordinates: [1, 2],
              },
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        status: 200,
        data: {
          properties: {
            grid: "x",
          },
        },
      });

    await serverFunction({ url: GOOD_REQUEST }, res);
    expect(res.statusCode).toBe(500);
    expect(res.statusMessage).toBe(INTERNAL_SERVER_ERROR_MESSAGE);
  });

  test("Check reverse proxy returns 500 when second call to NWS fails.", async () => {
    mockAxiosGetSpy
      .mockResolvedValueOnce({
        status: 200,
        data: {
          features: [
            {
              geometry: {
                coordinates: [1, 2],
              },
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        status: 200,
        data: {
          properties: {
            cwa: "LWX",
            gridX: 97,
            gridY: 71,
          },
        },
      })
      .mockResolvedValueOnce({
        status: 404,
      });

    await serverFunction({ url: GOOD_REQUEST }, res);
    expect(res.statusCode).toBe(500);
    expect(res.statusMessage).toBe(INTERNAL_SERVER_ERROR_MESSAGE);
  });

  test("Check reverse proxy returns 200 when everything works.", async () => {
    mockAxiosGetSpy
      .mockResolvedValueOnce({
        status: 200,
        data: {
          features: [
            {
              geometry: {
                coordinates: [1, 2],
              },
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        status: 200,
        data: {
          properties: {
            cwa: "TOP",
          },
        },
      })
      .mockResolvedValueOnce({
        status: 200,
        data: {
          properties: {
            cwa: "TOP",
          },
        },
      });

    await serverFunction({ url: GOOD_REQUEST }, res);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toBe(OK_MESSAGE);
  });
});
