import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const defaultOptions: CreateAxiosDefaults = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

const axiosInstance: AxiosInstance = axios.create(defaultOptions);

export interface IUseAxiosInstance {
  /**
   * Send a GET request
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get: <D, T, E>(url: string, params: AxiosRequestConfig<D> | null) => Promise<D>;
}

export const useAxiosInstance = (): IUseAxiosInstance => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const get = async <D, T, E>(url: string, params: AxiosRequestConfig<D> | null = null): Promise<D> => {
    return axiosInstance.get(url, params || undefined);
  };

  return {
    get,
  };
};
