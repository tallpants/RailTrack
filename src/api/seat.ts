import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";
import { formatDate } from "./live-status";

interface ISeatAvailable {
  response_code: number;
  train: {
    name: string;
  };
  from: {
    name: string;
  };
  to: {
    name: string;
  };
  seats: Array<{ available: { date: string; status: string } }>;
}
class SeatAvailable {
  public trainName: string;
  public source: string;
  public destination: string;
  public dates: Array<string>;
  public status: Array<string>;

  constructor(apiResponse: ISeatAvailable) {
    this.trainName = apiResponse.train.name;
    this.source = apiResponse.from.name;
    this.destination = apiResponse.to.name;
    this.dates = apiResponse.seats.map(date => date.available.date);
    this.status = apiResponse.seats.map(status => status.available.status);
  }
}

type SeatAvailableError = "notfound";

export default async function getSeats(
  source_code: string,
  destination_code: string,
  trainNumber: string,
  class_code: string
): Promise<{ data?: SeatAvailable; error?: SeatAvailableError }> {
  const datestring = formatDate(new Date());
  const quota = "GN";
  const response: AxiosResponse<
    ISeatAvailable
  > = await httpClient.get(`/check-seat/train/${trainNumber}
  /source/${source_code}/dest/${destination_code}
  /date/${datestring}/pref/${class_code}/quota/${quota}
  /apikey/${key}/`);

  switch (response.data.response_code) {
    case 200:
      return { data: new SeatAvailable(response.data), error: null };

    case 404:
      return { data: null, error: "notfound" };
  }
}
