/*
  Exports the getTrains function.
*/

import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";
import { formatDate } from "./live-status";
/*
  Interface describing the response having only the
  fields we're interested in.
*/
interface ITrain {
  response_code: number;
  total: string;
  train: Array<{ trains: { name: string } }>;
}
/*
  Class converts the  API response to a usable object.
*/
class Trains {
  public total: string;
  public trainName: Array<string>;
  constructor(apiResponse: ITrain) {
    this.total = apiResponse.total;
    this.trainName = apiResponse.train.map(name => name.trains.name);
  }
}
type TrainErrorReason = "notfound";

export default async function getTrains(
  source: string,
  destination: string
): Promise<{ data?: Trains; error?: TrainErrorReason }> {
  const datestring = formatDate(new Date());
  const response: AxiosResponse<ITrain> = await httpClient.get(
    `/between/source/${source}/dest/${destination}/date/${datestring}/apikey/${key}/`
  );

  switch (response.data.response_code) {
    case 200:
      return { data: new Trains(response.data), error: null };
    case 404:
      return { data: null, error: "notfound" };
  }
}
