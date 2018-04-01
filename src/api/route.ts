/**
 * Exports the getRoute function.
 */

import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";

/**
 * Interface describing the shape of the API response. Only the fields
 * we're interested in.
 *
 * https://railwayapi.com/api/#train-route
 */
interface IRouteResponse {
  response_code: number;

  train: {
    name: string;
    number: string;
  };

  route: Array<{ station: { name: string } }>;
}

/**
 * Class that converts the API response data into
 * a more usable object.
 */
class RouteStatus {
  public trainName: string;
  public trainNumber: string;
  public stationsOnRoute: Array<string>;

  constructor(apiResponse: IRouteResponse) {
    this.trainName = apiResponse.train.name;
    this.trainNumber = apiResponse.train.number;
    this.stationsOnRoute = apiResponse.route.map(stop => stop.station.name);
  }
}

type RouteErrorReason = "notfound";

export default async function getRoute(
  trainNumber: string
): Promise<{ data?: RouteStatus; error?: RouteErrorReason }> {
  const response: AxiosResponse<IRouteResponse> = await httpClient.get(
    `/route/train/${trainNumber}/apikey/${key}`
  );

  switch (response.data.response_code) {
    case 200:
      return { data: new RouteStatus(response.data), error: null };

    case 404:
      return { data: null, error: "notfound" };
  }
}
