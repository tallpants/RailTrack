/**
 * Contains the base URL and the API key.
 * Exports the API key and an Axios HTTP client instance configured to use the base URL.
 */

import axios from "axios";

const baseURL = "https://api.railwayapi.com/v2";

/**
 * API key for indianrailapi.com
 * On free tier, must be regenerated every 24 hours at http://indianrailapi.com/IndianRail/ApiKey
 */
export const key = process.env.API_KEY;
console.log(key);

/**
 * Axios HTTP client with the base URL configured to railwayapi.com's URL.
 */
export const httpClient = axios.create({
  baseURL
});
