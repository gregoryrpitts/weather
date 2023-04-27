import { renderHook } from "@testing-library/react";
import { act } from "@testing-library/react";

import mockAxios from "jest-mock-axios";
import useWeather from "services/weather";

jest.mock("axios", () => {
  return {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
});

describe("Weather service", () => {
  it("should initialize properly", () => {
    const { result } = renderHook(() => useWeather());
    expect(result.current.zip).toBe("");
    expect(result.current.weather).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it("should store weather and notify user when success", async () => {
    mockAxios.get.mockResolvedValueOnce(
      Promise.resolve({
        data: [],
        status: 200,
        statusText: "OK",
      })
    );

    const { result } = renderHook(() => useWeather());

    let response: boolean | undefined;
    await act(async () => {
      response = await result.current.fetchWeather("12345");
    });

    expect(response).toBe(true);
    expect(result.current.zip).toBe("12345");
    expect(result.current.weather).toStrictEqual([]);
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      result.current.clear();
    });
    expect(result.current.zip).toBe("");
    expect(result.current.weather).toStrictEqual(null);
    expect(result.current.isLoading).toBe(false);
  });

  it("should reset and notify user when fail", async () => {
    mockAxios.get.mockResolvedValueOnce(
      Promise.reject({
        status: 404,
        statusText: "Fail",
      })
    );

    const { result } = renderHook(() => useWeather());

    let response: boolean | undefined;
    await act(async () => {
      response = await result.current.fetchWeather("12345");
    });

    expect(response).toBe(false);
    expect(result.current.zip).toBe("");
    expect(result.current.weather).toStrictEqual(null);
    expect(result.current.isLoading).toBe(false);
  });
});
