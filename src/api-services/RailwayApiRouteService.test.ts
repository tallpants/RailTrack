import ApiClient from '../api-clients/ApiClient';
import { AxiosResponse } from 'axios';
import RailwayApiClient from '../api-clients/RailwayApiClient';
import RailwayApiRouteService, {
  RailwayApiRouteResponse,
} from './RailwayApiRouteService';
import { Route } from './RouteService';

describe('RailwayApiRouteService', () => {
  describe('getRoute', () => {
    it('Rejects with `REQUEST_FAILED` if HTTP request fails', () => {
      const mockRailwayApiClient: ApiClient = {
        get(): Promise<AxiosResponse> {
          return Promise.reject(
            new Error('Request failed with status code 400'),
          );
        },
      };

      const railwayApiRouteService = new RailwayApiRouteService(
        mockRailwayApiClient as RailwayApiClient,
      );

      expect(railwayApiRouteService.getRoute('12345')).rejects.toThrow(
        'REQUEST_FAILED',
      );
    });

    it('Rejects with `TRAIN_NOTFOUND` if API response code is 404', () => {
      const mockRailwayApiClient: ApiClient = {
        get(): Promise<AxiosResponse> {
          return Promise.resolve({
            data: { response_code: 404 },
          } as AxiosResponse);
        },
      };

      const railwayApiRouteService = new RailwayApiRouteService(
        mockRailwayApiClient as RailwayApiClient,
      );

      expect(railwayApiRouteService.getRoute('12345')).rejects.toThrow(
        'TRAIN_NOTFOUND',
      );
    });

    it('Resolves with a valid Route object on successful response', () => {
      const mockApiResponse: RailwayApiRouteResponse = {
        response_code: 200,
        train: {
          name: 'KLK-NDLS SHATABDI EXP',
          number: '12006',
        },
        route: [
          {
            station: {
              name: 'KALKA',
            },
          },
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
        ],
      };

      const expectedResult: Route = {
        trainName: 'KLK-NDLS SHATABDI EXP',
        trainNumber: '12006',
        stationsOnRoute: ['KALKA', 'CHANDIGARH', 'AMBALA CANT JN'],
      };

      const mockRailwayApiClient: ApiClient = {
        get(): Promise<AxiosResponse> {
          return Promise.resolve({ data: mockApiResponse } as AxiosResponse);
        },
      };

      const railwayApiRouteService = new RailwayApiRouteService(
        mockRailwayApiClient as RailwayApiClient,
      );

      expect(railwayApiRouteService.getRoute('12345')).resolves.toMatchObject(
        expectedResult,
      );
    });
  });
});
