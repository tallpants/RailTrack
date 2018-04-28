import { AxiosResponse } from 'axios';

export default interface APIClient {
  get(uri: string): Promise<AxiosResponse>;
}
