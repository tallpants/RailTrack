import axios from 'axios';

const baseURL = 'https://api.railwayapi.com/v2';

export const key = process.env.API_KEY;
if (key === undefined) {
  throw new Error(`
    API key missing.
    Get an API key from railwayapi.com,
    and make it available as an environment variable with the name API_KEY.
  `);
}

export const httpClient = axios.create({
  baseURL,
});
