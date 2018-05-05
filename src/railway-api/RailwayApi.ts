import { PnrStatus, LiveStatus, Route } from './types';
import Axios from 'axios';
import formatDate from './helpers/formatDate';

export default class RailwayApi {
  private _apiKey: string;

  constructor(apiKey: string) {
    this._apiKey = apiKey;
  }

  private _get(uri: string) {
    return Axios.get(
      `https://api.railwayapi.com/v2/${uri}/apikey/${this._apiKey}`,
    );
  }

  async getPnrStatus(pnrNumber: string): Promise<PnrStatus> {
    interface ApiPnrResponse {
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

    let data: ApiPnrResponse;

    try {
      ({ data } = await this._get(`pnr-status/${pnrNumber}`));
    } catch (_) {
      throw new Error('REQUEST_FAILED');
    }

    switch (data.response_code) {
      case 221:
      case 404:
      case 405:
        throw new Error('PNR_NOTFOUND');
      case 220:
        throw new Error('PNR_FLUSHED');
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

  async getLiveStatus(trainNumber: string): Promise<LiveStatus> {
    interface ApiLiveStatusResponse {
      response_code: number;
      position: string;
      train: {
        number: string;
        name: string;
      };
      route: Array<{ station: { name: string } }>;
    }

    let data: ApiLiveStatusResponse;

    const datestring = formatDate(new Date());

    try {
      ({ data } = await this._get(
        `live/train/${trainNumber}/date/${datestring}`,
      ));
    } catch (_) {
      throw new Error('REQUEST_FAILED');
    }

    switch (data.response_code) {
      case 404:
      case 405:
        throw new Error('TRAIN_NOTFOUND');
      case 210:
        throw new Error('TRAIN_NOT_RUNNING');
    }

    return {
      trainName: data.train.name,
      trainNumber: data.train.number,
      statusString: data.position,
      sourceStationName: data.route[0].station.name,
      destinationStationName: data.route[data.route.length - 1].station.name,
    };
  }

  async getRoute(trainNumber: string): Promise<Route> {
    interface ApiRouteResponse {
      response_code: number;
      train: {
        name: string;
        number: string;
      };
      route: Array<{ station: { name: string } }>;
    }

    let data: ApiRouteResponse;

    try {
      ({ data } = await this._get(`route/train/${trainNumber}`));
    } catch (_) {
      throw new Error('REQUEST_FAILED');
    }

    if (data.response_code === 404) {
      throw new Error('TRAIN_NOTFOUND');
    }

    return {
      trainName: data.train.name,
      trainNumber: data.train.number,
      stationsOnRoute: data.route.map(routeItem => routeItem.station.name),
    };
  }
}
