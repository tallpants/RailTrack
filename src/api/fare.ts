import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";
import { formatDate } from "./live-status";

interface IFare {
  response_code: number;
  from_station: {
    name: string;
  };
  to_station: {
    name: string;
  };
  train: {
    name: string;
  };
  journey_class: {
    name: string;
  };
  fare: string;
}

class Fare {
  public source: string;
  public destination: string;
  public className: string;
  public trainName: string;
  public fare: string;
  constructor(apiResponse: IFare) {
    this.source = apiResponse.from_station.name;
    this.destination = apiResponse.to_station.name;
    this.trainName = apiResponse.train.name;
    this.className = apiResponse.journey_class.name;
    this.fare = apiResponse.fare;
  }
}

type FareErrorReason = "notfound" | "classnotpresent";

export default async function checkFare(
  source_code: string,
  destination_code: string,
  trainNumber: string,
  class_code: string,
  age: number
): Promise<{ data?: Fare; error?: FareErrorReason }> {
  const datestring = formatDate(new Date());
  const quota = "GN";
  const response: AxiosResponse<
    IFare
  > = await httpClient.get(`/fare/train/${trainNumber}/source/${source_code}
  /dest/${destination_code}/age/${age}/pref/${class_code}/quota/${quota}
  /date/${datestring}/apikey/${key}/`);

  switch (response.data.response_code) {
    case 404:
      return { data: null, error: "notfound" };
    case 211:
      return { data: null, error: "classnotpresent" };
    case 200:
      return { data: new Fare(response.data), error: null };
  }
}
