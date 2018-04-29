import PnrService, { PnrStatus } from './PnrService';
import RailwayAPIClient from '../clients/RailwayAPIClient';

// https://railwayapi.com/api/#pnr-status
export interface RailwayApiPnrResponse {
  response_code: number;
  doj: string;
  train: {
    name: string;
    number: string;
  };
  from_station: {
    name: string;
  };
  to_station: {
    name: string;
  };
  passengers: Array<{ current_status: string }>;
}

export default class RailwayApiPnrService implements PnrService {
  private railwayApiClient: RailwayAPIClient;

  constructor(railwayApiClient: RailwayAPIClient) {
    this.railwayApiClient = railwayApiClient;
  }

  async getPnrStatus(pnrNumber: string): Promise<PnrStatus> {
    let data: RailwayApiPnrResponse;

    try {
      ({ data } = await this.railwayApiClient.get(`pnr-status/${pnrNumber}`));
    } catch (err) {
      throw new Error('REQUEST_FAILED');
    }

    switch (data.response_code) {
      case 405:
        throw new Error('PNR_NOTFOUND');
      case 220:
        throw new Error('PNR_FLUSHED');
      case 221:
        throw new Error('PNR_INVALID');
    }

    return {
      journeyDate: data.doj,
      fromStation: data.from_station.name,
      toStation: data.to_station.name,
      trainName: data.train.name,
      trainNumber: data.train.number,
      passengerStatuses: data.passengers.map(
        passenger => passenger.current_status,
      ),
    };
  }
}
