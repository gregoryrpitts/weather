import { IncomingMessage } from "http";

export type TServerRequest = Pick<IncomingMessage, "url">;

export interface ILatLongPair {
  latitude: number;
  longitude: number;
}
