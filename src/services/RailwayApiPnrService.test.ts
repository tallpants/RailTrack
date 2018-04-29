import RailwayApiPnrService, {
  RailwayApiPnrResponse,
} from './RailwayApiPnrService';

import APIClient from '../clients/APIClient';
import RailwayAPIClient from '../clients/RailwayAPIClient';
import { AxiosResponse } from 'axios';
import { PnrStatus } from './PnrService';

describe('RailwayApiPnrService', () => {
  describe('getPnrStatus', () => {
    it('Rejects with `REQUEST_FAILED` if HTTP request fails', () => {
      const mockRailwayApiClient: APIClient = {
        get(): Promise<AxiosResponse> {
          return Promise.reject(
            new Error('Request failed with status code 400'),
          );
        },
      };

      const railwayApiPnrService = new RailwayApiPnrService(
        mockRailwayApiClient as RailwayAPIClient,
      );

      expect(railwayApiPnrService.getPnrStatus('12345')).rejects.toThrow(
        'REQUEST_FAILED',
      );
    });

    it('Rejects with `PNR_NOTFOUND` if API response code is 405', () => {
      const mockRailwayApiClient: APIClient = {
        get(): Promise<AxiosResponse> {
          return Promise.resolve({
            data: { response_code: 405 },
          } as AxiosResponse);
        },
      };

      const railwayApiPnrService = new RailwayApiPnrService(
        mockRailwayApiClient as RailwayAPIClient,
      );
      expect(railwayApiPnrService.getPnrStatus('12345')).rejects.toThrow(
        'PNR_NOTFOUND',
      );
    });

    it('Rejects with `PNR_FLUSHED` if API response code is 220', () => {
      const mockRailwayApiClient: APIClient = {
        get(): Promise<AxiosResponse> {
          return Promise.resolve({
            data: { response_code: 220 },
          } as AxiosResponse);
        },
      };

      const railwayApiPnrService = new RailwayApiPnrService(
        mockRailwayApiClient as RailwayAPIClient,
      );
      expect(railwayApiPnrService.getPnrStatus('12345')).rejects.toThrow(
        'PNR_FLUSHED',
      );
    });

    it('Rejects with `PNR_INVALID` if API response code is 221', () => {
      const mockRailwayApiClient: APIClient = {
        get(): Promise<AxiosResponse> {
          return Promise.resolve({
            data: { response_code: 221 },
          } as AxiosResponse);
        },
      };

      const railwayApiPnrService = new RailwayApiPnrService(
        mockRailwayApiClient as RailwayAPIClient,
      );
      expect(railwayApiPnrService.getPnrStatus('12345')).rejects.toThrow(
        'PNR_INVALID',
      );
    });

    it('Resolves with a valid PnrStatus object on successful response', () => {
      const mockApiResponse: RailwayApiPnrResponse = {
        response_code: 200,
        doj: '25-6-2017',
        from_station: {
          name: 'Kopargaon',
        },
        to_station: {
          name: 'Hazrat Nizamuddin',
        },
        train: {
          name: 'GOA EXPRESS',
          number: '12779',
        },
        passengers: [
          {
            current_status: 'RLWL/11',
          },
          {
            current_status: 'RLWL/12',
          },
          {
            current_status: 'RLWL/13',
          },
        ],
      };

      const expectedResult: PnrStatus = {
        journeyDate: '25-6-2017',
        fromStation: 'Kopargaon',
        toStation: 'Hazrat Nizamuddin',
        trainName: 'GOA EXPRESS',
        trainNumber: '12779',
        passengerStatuses: ['RLWL/11', 'RLWL/12', 'RLWL/13'],
      };

      const mockRailwayApiClient: APIClient = {
        get(): Promise<AxiosResponse> {
          return Promise.resolve({ data: mockApiResponse } as AxiosResponse);
        },
      };

      const railwayApiPnrService = new RailwayApiPnrService(
        mockRailwayApiClient as RailwayAPIClient,
      );
      expect(railwayApiPnrService.getPnrStatus('12345')).resolves.toMatchObject(
        expectedResult,
      );
    });
  });
});
