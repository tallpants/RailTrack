/**
 * Contains the base URL and the API key.
 * Exports the API key and an Axios HTTP client instance configured to use the base URL.
 */

import axios from "axios";

const baseURL = "http://indianrailapi.com/api/v1";

/**
 * API key for indianrailapi.com
 * On free tier, must be regenerated every 24 hours at http://indianrailapi.com/IndianRail/ApiKey
 */
export const key = "d040a6d701ddc01dc36662b8a62f83e6"; // TODO: Externalize this.

/**
 * Axios HTTP client with the base URL configured to railwayapi.com's URL.
 */
export const httpClient = axios.create({
  baseURL
});
