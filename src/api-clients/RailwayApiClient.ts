import Axios, { AxiosResponse } from 'axios';

import ApiClient from './ApiClient';

export default class RailwayApiClient implements ApiClient {
  private apiKey: string;
  private baseURL: string = 'https://api.railwayapi.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  get(uri: string): Promise<AxiosResponse> {
    return Axios.get(`${this.baseURL}/${uri}/apikey/${this.apiKey}`);
  }
}
