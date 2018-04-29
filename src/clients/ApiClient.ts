import { AxiosResponse } from 'axios';

export default interface ApiClient {
  get(uri: string): Promise<AxiosResponse>;
}
