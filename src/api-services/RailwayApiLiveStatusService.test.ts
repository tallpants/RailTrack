import ApiClient from '../api-clients/ApiClient';
import { AxiosResponse } from 'axios';
import RailwayApiLiveStatusService, {
  RailwayApiLiveStatusResponse,
} from './RailwayApiLiveStatusService';
import RailwayApiClient from '../api-clients/RailwayApiClient';
import { LiveStatus } from './LiveStatusService';

describe('RailwayApiLiveStatusService', () => {
  describe('getLiveStatus', () => {
    it('Rejects with `REQUEST_FAILED` if HTTP request fails', () => {
      const mockRailwayApiClient: ApiClient = {
        get(): Promise<AxiosResponse> {
          return Promise.reject(
            new Error('Request failed with status code 400'),
          );
        },
      };

      const railwayApiLiveStatusService = new RailwayApiLiveStatusService(
        mockRailwayApiClient as RailwayApiClient,
      );

      expect(
        railwayApiLiveStatusService.getLiveStatus('12345'),
      ).rejects.toThrow('REQUEST_FAILED');
    });

    it('Rejects with `TRAIN_NOTFOUND` if API response code is 404', () => {
      const mockRailwayApiClient: ApiClient = {
        get(): Promise<AxiosResponse> {
          return Promise.resolve({
            data: { response_code: 404 },
          } as AxiosResponse);
        },
      };

      const railwayApiPnrService = new RailwayApiLiveStatusService(
        mockRailwayApiClient as RailwayApiClient,
      );
      expect(railwayApiPnrService.getLiveStatus('12345')).rejects.toThrow(
        'TRAIN_NOTFOUND',
      );
    });

    it('Rejects with `TRAIN_NOTFOUND` if API response code is 405', () => {
      const mockRailwayApiClient: ApiClient = {
        get(): Promise<AxiosResponse> {
          return Promise.resolve({
            data: { response_code: 405 },
          } as AxiosResponse);
        },
      };

      const railwayApiPnrService = new RailwayApiLiveStatusService(
        mockRailwayApiClient as RailwayApiClient,
      );
      expect(railwayApiPnrService.getLiveStatus('12345')).rejects.toThrow(
        'TRAIN_NOTFOUND',
      );
    });

    it('Rejects with `TRAIN_NOT_RUNNING_ON_DATE` if API response code is 210', () => {
      const mockRailwayApiClient: ApiClient = {
        get(): Promise<AxiosResponse> {
          return Promise.resolve({
            data: { response_code: 210 },
          } as AxiosResponse);
        },
      };

      const railwayApiPnrService = new RailwayApiLiveStatusService(
        mockRailwayApiClient as RailwayApiClient,
      );
      expect(railwayApiPnrService.getLiveStatus('12345')).rejects.toThrow(
        'TRAIN_NOT_RUNNING_ON_DATE',
      );
    });
  });

  it('Resolves with a valid LiveStatus object on successful response', () => {
    const mockApiResponse: RailwayApiLiveStatusResponse = {
      response_code: 200,
      train: {
        number: '12046',
        name: 'CDG NDLS SHTBDI',
      },
      position: 'Train has reached Destination and late by 5 minutes',
      route: [
        {
          station: {
            name: 'CHANDIGARH',
          },
        },
        {
          station: {
            name: 'AMBALA CANT JN',
          },
        },
        {
          station: {
            name: 'NEW DELHI',
          },
        },
      ],
    };

    const expectedResult: LiveStatus = {
      statusString: 'Train has reached Destination and late by 5 minutes',
      sourceStationName: 'CHANDIGARH',
      destinationStationName: 'NEW DELHI',
      trainName: 'CDG NDLS SHTBDI',
      trainNumber: '12046',
    };

    const mockRailwayApiClient: ApiClient = {
      get(): Promise<AxiosResponse> {
        return Promise.resolve({ data: mockApiResponse } as AxiosResponse);
      },
    };

    const railwayApiLiveStatusService = new RailwayApiLiveStatusService(
      mockRailwayApiClient as RailwayApiClient,
    );
    expect(
      railwayApiLiveStatusService.getLiveStatus('12345'),
    ).resolves.toMatchObject(expectedResult);
  });
});
