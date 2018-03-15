/*
  Exports the getRouteList function - returns the stations that 
  the train passes through in its route
*/

import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";
/*
  Interface describing the shape of the railwayapi Route response
*/

interface IRouteResponse {
  ResponseCode: number;

  TrainName: {
    Name: string;
  };

  RouteList: Array<{ FullName: string }>;
}
/*
  Class that takes the API response and creates an object
  describing it
*/

class RouteStatus {
  public trainName: string;
  public route: Array<string>;

  constructor(apiResponse: IRouteResponse) {
    this.trainName = apiResponse.TrainName.Name;
    this.route = apiResponse.RouteList.map(station => station.FullName);
  }
}

type RouteErrorReason = "notfound";

export default async function getRouteList(
  trainNumber: string
): Promise<{ data?: RouteStatus; error?: RouteErrorReason }> {
  const response: AxiosResponse<IRouteResponse> = await httpClient.get(
    `/pnrstatus/apikey/${key}/trainno/${trainNumber}`
  );

  switch (response.data.ResponseCode) {
    case 200:
      return { data: new RouteStatus(response.data), error: null };

    case 404:
      return { data: null, error: "notfound" };
  }
}
