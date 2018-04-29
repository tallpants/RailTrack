import LiveStatusService, { LiveStatus } from './LiveStatusService';
import RailwayApiClient from '../api-clients/RailwayApiClient';

// https://railwayapi.com/api/#live-train-status

export interface RailwayApiLiveStatusResponse {
  response_code: number;
  position: string;
  train: {
    number: string;
    name: string;
  };
  route: Array<{ station: { name: string } }>;
}

export default class RailwayApiLiveStatusService implements LiveStatusService {
  private railwayApiClient: RailwayApiClient;

  constructor(railwayApiClient: RailwayApiClient) {
    this.railwayApiClient = railwayApiClient;
  }

  async getLiveStatus(trainNumber: string): Promise<LiveStatus> {
    let data: RailwayApiLiveStatusResponse;

    const datestring = formatDate(new Date());
    try {
      ({ data } = await this.railwayApiClient.get(
        `live/train/${trainNumber}/date/${datestring}`,
      ));
    } catch (err) {
      throw new Error('REQUEST_FAILED');
    }

    switch (data.response_code) {
      case 404:
      case 405:
        throw new Error('TRAIN_NOTFOUND');
      case 210:
        throw new Error('TRAIN_NOT_RUNNING_ON_DATE');
    }

    return {
      trainName: data.train.name,
      trainNumber: data.train.number,
      statusString: data.position,
      sourceStationName: data.route[0].station.name,
      destinationStationName: data.route[data.route.length - 1].station.name,
    };
  }
}

// Takes a Date object and returns a 'dd-mm-yyyy' date string.
export function formatDate(d: Date): string {
  const day = d.getDate();
  const month = d.getMonth() + 1; // The month number returned by getMonth() is 0 indexed.
  const year = d.getFullYear();

  return `${padZero(day)}-${padZero(month)}-${year}`;
}

// Prepends a 0 if the number is one digit long.
// 9 -> 09, but 13 -> 13
export function padZero(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }
  return `${num}`;
}
