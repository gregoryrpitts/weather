/**
 * I don't think this is an ideal solution, but it's a placeholder for a more elegeant string table
 * that allows for i18n and/or localization. At least it lets me pull string constants out of the components,
 * which is worth doing at the beginning of projects in order to avoid combing through them later on when you
 * want a better solution.
 */

const strings = {
  APP_RESET: "You just reset the local storage and search params",
  APP_TITLE: "Weather App",
  COPIED: "Copied Share URL!",
  ERROR_FETCH: "Error fetching weather data! This is a bad error message, see README.",
  MADE_BY: "Made by",
  SEARCH_BY_ZIP: "Search by Zip",
  SEARCH: "Search",
  WEATHER_REPORT_TITLE: "Hourly Weather Forecast",
  WELCOME_MESSAGE: "Find your hourly weather forecast by US 5 digit zip code",
};

export default strings;
