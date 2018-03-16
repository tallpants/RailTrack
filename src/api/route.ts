/**
 * Exports the getRoute function.
 */

import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";

/**
 * Interface describing the shape of the API response. Only the fields
 * we're interested in.
 *
 * http://indianrailapi.com/IndianRail/API/TrainRoute
 */
interface IRouteResponse {
  ResponseCode: number;

  TrainName: {
    Name: string;
  };

  RouteList: Array<{ FullName: string }>;
}

/**
 * Class that converts the API response data into
 * a more usable object.
 */
class RouteStatus {
  public trainName: string;
  public stationsOnRoute: Array<string>;

  constructor(apiResponse: IRouteResponse) {
    this.trainName = apiResponse.TrainName.Name;
    this.stationsOnRoute = apiResponse.RouteList.map(
      station => station.FullName
    );
  }
}

type RouteErrorReason = "notfound";

export default async function getRoute(
  trainNumber: string
): Promise<{ data?: RouteStatus; error?: RouteErrorReason }> {
  const response: AxiosResponse<IRouteResponse> = await httpClient.get(
    `/trainroute/apikey/${key}/trainno/${trainNumber}`
  );

  switch (response.data.ResponseCode) {
    case 200:
      return { data: new RouteStatus(response.data), error: null };

    case 404:
      return { data: null, error: "notfound" };
  }
}
