import RouteService, { Route } from './RouteService';
import RailwayApiClient from '../clients/RailwayApiClient';

// https://railwayapi.com/api/#train-route
export interface RailwayApiRouteResponse {
  response_code: number;
  train: {
    name: string;
    number: string;
  };
  route: Array<{ station: { name: string } }>;
}

export default class RailwayApiRouteService implements RouteService {
  railwayApiClient: RailwayApiClient;

  constructor(railwayApiClient: RailwayApiClient) {
    this.railwayApiClient = railwayApiClient;
  }

  async getRoute(trainNumber: string): Promise<Route> {
    let data: RailwayApiRouteResponse;

    try {
      ({ data } = await this.railwayApiClient.get(
        `route/train/${trainNumber}`,
      ));
    } catch (err) {
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
