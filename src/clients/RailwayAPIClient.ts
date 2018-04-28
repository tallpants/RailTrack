import Axios, { AxiosResponse } from 'axios';

import APIClient from './APIClient';

export default class RailwayAPIClient implements APIClient {
  private apiKey: string;
  private baseURL: string = 'https://api.railwayapi.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  get(uri: string): Promise<AxiosResponse> {
    return Axios.get(`${this.baseURL}/${uri}/apikey/${this.apiKey}`);
  }
}
