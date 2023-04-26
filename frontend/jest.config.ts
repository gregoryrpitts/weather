/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const config = {
  clearMocks: true,
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^constants(.*)$": "<rootDir>/src/constants$1",
    "^icons(.*)$": "<rootDir>/src/icons$1",
    "^pages(.*)$": "<rootDir>/src/pages$1",
    "^providers(.*)$": "<rootDir>/src/providers$1",
    "^services(.*)$": "<rootDir>/src/services$1",
    "^widgets(.*)$": "<rootDir>/src/widgets$1",
  },
  testEnvironment: "jsdom",
};

export default config;
