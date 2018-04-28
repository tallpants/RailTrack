import Axios from 'axios';
import RailwayAPIClient from './RailwayAPIClient';

jest.mock('axios');

describe('RailwayAPIClient', () => {
  const mockApiKey = '12345';
  const railwayAPIClient = new RailwayAPIClient(mockApiKey);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Makes a GET request using Axios', () => {
    railwayAPIClient.get('hello/world');
    expect((Axios.get as jest.Mock).mock.calls.length).toBe(1);
  });

  it('Appends the API Key to the GET request URL', () => {
    railwayAPIClient.get('hello/world');

    expect((Axios.get as jest.Mock).mock.calls[0][0]).toBe(
      `https://api.railwayapi.com/v2/hello/world/apikey/${mockApiKey}`,
    );
  });
});
