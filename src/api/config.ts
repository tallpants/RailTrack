/**
 * Contains the base URL and the API key.
 * Exports the API key and an Axios HTTP client instance configured to use the base URL.
 */

import axios, { AxiosInstance } from "axios";

const baseURL: string = "https://api.railwayapi.com/v2";

/**
 * API key for railwayapi.com
 */
export const key: string = "59x3poqhl7"; // TODO: Externalize this.

/**
 * Axios HTTP client with the base URL configured to railwayapi.com's URL.
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL
});
