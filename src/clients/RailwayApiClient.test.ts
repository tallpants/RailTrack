import Axios from 'axios';
import RailwayApiClient from './RailwayApiClient';

jest.mock('axios');

describe('RailwayApiClient', () => {
  const mockApiKey = '12345';
  const railwayApiClient = new RailwayApiClient(mockApiKey);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Makes GET requests to RailwayAPI with the API Key included', () => {
    railwayApiClient.get('hello/world');

    expect((Axios.get as jest.Mock).mock.calls[0][0]).toBe(
      `https://api.railwayapi.com/v2/hello/world/apikey/${mockApiKey}`,
    );
  });
});
