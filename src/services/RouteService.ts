export interface Route {
  trainName: string;
  trainNumber: string;
  stationsOnRoute: Array<string>;
}

export default interface RouteService {
  getRoute(trainNumber: string): Promise<Route>;
}
