/**
 * Contains the base URL and the API key.
 * Exports the API key and an Axios HTTP client instance configured to use the base URL.
 */

import axios from 'axios';

const baseURL = 'https://api.railwayapi.com/v2';

/**
 * API key for railwayapi.com
 */
export const key = process.env.API_KEY;
if (key === undefined) {
  throw new Error(`
    API key missing.
    Get an API key from railwayapi.com,
    and make it available as an environment variable with the name API_KEY.
  `);
}

/**
 * Axios HTTP client with the base URL configured to railwayapi.com's URL.
 */
export const httpClient = axios.create({
  baseURL,
});
