// Contains the base URL and the API key.
//Exports the API key and an Axios HTTP client instance configured to use the base URL.

import axios, { AxiosInstance } from "axios";

const baseURL: string = "https://api.railwayapi.com/v2";

/**
 * FIXME: Documentation
 */
export const key: string = "59x3poqhl7"; // TODO: Externalize this.

/**
 * FIXME: Documentation
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL
});
