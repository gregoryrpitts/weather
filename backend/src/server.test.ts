import { describe, expect, test } from "@jest/globals";

import { URL_REGEX } from "./constants";

describe("Sanity Test", () => {
  test("1 is 1", () => {
    expect(1).toBe(1);
  });
});

describe("Text URL parsing", () => {
  test("Check url prefix", () => {
    expect(URL_REGEX.test("/zip/12345")).toBe(true);
    expect(URL_REGEX.test("zip/12345")).toBe(false);
    expect(URL_REGEX.test("/zip12345")).toBe(false);
    expect(URL_REGEX.test("/other/12345")).toBe(false);
  });
  test("Check number of digits in zip", () => {
    expect(URL_REGEX.test("/zip/1234")).toBe(false);
    expect(URL_REGEX.test("/zip/12345")).toBe(true);
    expect(URL_REGEX.test("/zip/123556")).toBe(false);
  });
});
