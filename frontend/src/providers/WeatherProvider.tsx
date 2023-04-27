import React from "react";
import { useSearchParams } from "react-router-dom";

import STRINGS from "constants/strings";

import { loadState } from "services/localStorage";
import { removeState } from "services/localStorage";
import { saveState } from "services/localStorage";
import { IUseWeather } from "services/weather";
import useWeather from "services/weather";

import { IWeatherResponse } from "types/weather";
import { UNIT_KEY } from "services/localStorage/keys";
import { ZIP_KEY } from "services/localStorage/keys";
import useNotification, { ERROR_NOTIFICATION_TYPE, INFO_NOTIFICATION_TYPE } from "services/notifications";

const ZIP_REGEX = /^\d{5}$/;

export enum EUnitOfMeasure {
  FARENHEIT = "F",
  CELSIUS = "C",
}

interface ILocalStorageUnitState {
  unit: string;
}

interface ILocalStorageZipState {
  zip: string;
}

const loadUnit = (): string => {
  const data: ILocalStorageUnitState | undefined = loadState(UNIT_KEY) as ILocalStorageUnitState | undefined;
  if (data && data.unit) {
    return data.unit;
  }
  return "";
};

const loadZip = (): string => {
  const data: ILocalStorageZipState | undefined = loadState(ZIP_KEY) as ILocalStorageZipState | undefined;
  if (data && data.zip) {
    return data.zip;
  }
  return "";
};

export interface IWeatherContext {
  clear?: () => void;
  isLoading: boolean;
  unit: EUnitOfMeasure;
  setUnit?: (unit: EUnitOfMeasure) => void;
  setZip?: (zipCode: string) => void;
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [unit, setUnit] = React.useState<EUnitOfMeasure>((loadUnit() as EUnitOfMeasure) || EUnitOfMeasure.FARENHEIT);
  const [zip, setZip] = React.useState<string>(searchParams.get("zip") || loadZip());

  const weatherHook: IUseWeather = useWeather();
  const notificationHook = useNotification();

  const fetchWeather = async (zipCode: string): Promise<void> => {
    const success = await weatherHook.fetchWeather(zipCode);
    if (success) {
      saveState(ZIP_KEY, { zip: zipCode });
      setSearchParams({ zip: zipCode });
    } else {
      notificationHook.enqueue(STRINGS.ERROR_FETCH, ERROR_NOTIFICATION_TYPE);
    }
  };

  // Only fetch after first load.
  const didMount = React.useRef<boolean | null>(false);
  React.useEffect(() => {
    if (didMount.current) {
      zip && fetchWeather(zip);
    } else {
      setInitialized(true);
      didMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip]);

  /**
   * The user can attempt to tell the provider to service a new zip code. Provider can decide if it's OK.
   *
   * @param zipCode The new Zip Code.
   */
  const handleZipChange = async (zipCode: string): Promise<void> => {
    if (zipCode === zip && !weatherHook.zip) {
      notificationHook.enqueue(STRINGS.ERROR_FETCH, ERROR_NOTIFICATION_TYPE);
    }
    if (zipCode !== weatherHook.zip && ZIP_REGEX.test(zipCode)) {
      setZip(zipCode);
    }
  };

  const handleClear = (): void => {
    removeState(UNIT_KEY);
    removeState(ZIP_KEY);
    setSearchParams({});
    setZip("");
    weatherHook.clear();
    notificationHook.enqueue(STRINGS.APP_RESET, INFO_NOTIFICATION_TYPE);
  };

  const handleUnitChange = (unit: EUnitOfMeasure): void => {
    setUnit(unit);
    saveState(UNIT_KEY, { unit: unit });
  };

  return (
    <WeatherContext.Provider
      value={{
        clear: handleClear,
        isLoading: weatherHook.isLoading || !initialized,
        setUnit: handleUnitChange,
        setZip: handleZipChange,
        unit: unit,
        weather: weatherHook.weather,
        zip: weatherHook.zip,
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
