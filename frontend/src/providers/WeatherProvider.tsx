import React from "react";

import { IUseWeather } from "services/weather";
import useWeather from "services/weather";
import { IWeatherResponse } from "types/weather";

export enum EUnitOfMeasure {
  FARENHEIT = "F",
  CELSIUS = "C",
}

export interface IWeatherContext {
  fetchWeather?: (zipCode: string) => Promise<void>;
  isLoading: boolean;
  unit: EUnitOfMeasure;
  setUnit?: React.Dispatch<React.SetStateAction<EUnitOfMeasure>>;
  weather: IWeatherResponse | null;
  zip: string;
}

export const defaultWeatherContext: IWeatherContext = {
  isLoading: false,
  unit: EUnitOfMeasure.FARENHEIT,
  weather: null,
  zip: "",
};

const WeatherContext: React.Context<IWeatherContext> = React.createContext<IWeatherContext>(defaultWeatherContext);

interface IWeatherProviderProps {
  children: React.ReactNode;
}

const WeatherProvider: React.FunctionComponent<IWeatherProviderProps> = ({ children }) => {
  const [unit, setUnit] = React.useState<EUnitOfMeasure>(EUnitOfMeasure.FARENHEIT);
  const [zip, setZip] = React.useState<string>("");
  const weatherHook: IUseWeather = useWeather();

  const fetchWeather = async (zipCode: string): Promise<void> => {
    if (zipCode !== zip) {
      setZip(zipCode);
      await weatherHook.fetchWeather(zipCode);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        fetchWeather,
        isLoading: weatherHook.isLoading,
        setUnit,
        unit: unit,
        weather: weatherHook.weather,
        zip: zip,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherProvider = (): IWeatherContext => {
  return React.useContext<IWeatherContext>(WeatherContext);
};

export default WeatherProvider;
