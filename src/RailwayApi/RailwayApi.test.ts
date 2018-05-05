import RailwayApi from './RailwayApi';
import { PnrStatus, LiveStatus, Route } from './types';

describe('RailwayApi', () => {
  afterEach(jest.resetAllMocks);

  describe('configure', () => {
    it('sets the _apiKey property to the supplied API key', () => {
      const apiKey = '12345';
      const railwayApi = new RailwayApi(apiKey);
      expect((railwayApi as any)._apiKey).toEqual(apiKey);
    });
  });

  describe('_get', () => {
    it('Makes GET requests to the base URL by appending URI and API key', () => {
      const mockedGet = jest.fn();

      jest.setMock('axios', { get: mockedGet });

      const apiKey = '12345';
      const testUri = 'testuri';
      const railwayApi = new RailwayApi(apiKey) as any;

      railwayApi._get(testUri).then(() => {
        const argument: string = mockedGet.mock.calls[0][0];
        expect(argument).toEqual(
          `https://api.railwayapi.com/v2/${testUri}/apikey/${apiKey}`,
        );
      });
    });

    it('Rejects with `REQUEST_FAILED` if HTTP request fails', () => {
      const mockedGet = jest.fn(() =>
        Promise.reject(new Error('Request failed with status code 400')),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('') as any;
      expect(railwayApi._get('')).rejects.toThrow('REQUEST_FAILED');
    });
  });

  describe('getPnrStatus', () => {
    it('Rejects with `PNR_NOTFOUND` if API response code is 221', () => {
      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: { response_code: 221 },
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getPnrStatus('12345')).rejects.toThrow('PNR_NOTFOUND');
    });

    it('Rejects with `PNR_NOTFOUND` if API response code is 404', () => {
      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: { response_code: 404 },
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getPnrStatus('12345')).rejects.toThrow('PNR_NOTFOUND');
    });

    it('Rejects with `PNR_NOTFOUND` if API response code is 405', () => {
      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: { response_code: 405 },
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getPnrStatus('12345')).rejects.toThrow('PNR_NOTFOUND');
    });

    it('Rejects with `PNR_FLUSHED` if API response code is 220', () => {
      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: { response_code: 220 },
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getPnrStatus('12345')).rejects.toThrow('PNR_FLUSHED');
    });

    it('Resolves with a valid PnrStatus object on successful response', () => {
      const mockApiResponse = {
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

      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: mockApiResponse,
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getPnrStatus('12345')).resolves.toMatchObject(
        expectedResult,
      );
    });
  });

  describe('getLiveStatus', () => {
    it('Rejects with `TRAIN_NOTFOUND` if API response code is 404', () => {
      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: { response_code: 404 },
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getLiveStatus('12345')).rejects.toThrow(
        'TRAIN_NOTFOUND',
      );
    });

    it('Rejects with `TRAIN_NOTFOUND` if API response code is 405', () => {
      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: { response_code: 405 },
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getLiveStatus('12345')).rejects.toThrow(
        'TRAIN_NOTFOUND',
      );
    });

    it('Rejects with `TRAIN_NOT_RUNNING` if API response code is 210', () => {
      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: { response_code: 210 },
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getLiveStatus('12345')).rejects.toThrow(
        'TRAIN_NOT_RUNNING',
      );
    });

    it('Resolves with a valid LiveStatus object on successful response', () => {
      const mockApiResponse = {
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

      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: mockApiResponse,
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getLiveStatus('12345')).resolves.toMatchObject(
        expectedResult,
      );
    });
  });

  describe('getRoute', () => {
    it('Rejects with `TRAIN_NOTFOUND` if API response code is 404', () => {
      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: { response_code: 404 },
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getRoute('12345')).rejects.toThrow('TRAIN_NOTFOUND');
    });

    it('Resolves with a valid Route object on successful response', () => {
      const mockApiResponse = {
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

      const mockedGet = jest.fn(() =>
        Promise.resolve({
          data: mockApiResponse,
        }),
      );

      jest.setMock('axios', { get: mockedGet });

      const railwayApi = new RailwayApi('');
      expect(railwayApi.getRoute('12345')).resolves.toMatchObject(
        expectedResult,
      );
    });
  });
});
