import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";
import { formatDate, padZero } from "./live-status";

interface ISeatAvailableResponse {
  ResponseCode: number;
  TrainName: string;
  From: {
    Name: string;
  };
  To: {
    Name: string;
  };
  Available: {
    Dates: Array<{ Date: string }>;
    Seats: Array<{ Status: string }>;
  };
}

class SeatAvailable {
  public Source: string;
  public Destination: string;
  public trainName: string;
  public dates: Array<string>;
  public statuses: Array<string>;

  constructor(apiResponse: ISeatAvailableResponse) {
    this.Source = apiResponse.From.Name;
    this.Destination = apiResponse.To.Name;
    this.trainName = apiResponse.TrainName;
    this.dates = apiResponse.Available.Dates.map(date => date.Date);
    this.statuses = apiResponse.Available.Seats.map(status => status.Status);
  }
}

type SeatErrorReason = "notfound";

export default async function getSeatAvailable(
  trainNumber: string,
  source: string,
  destination: string,
  classCode: string,
  quota: string
): Promise<{ data?: SeatAvailable; error?: SeatErrorReason }> {
  const datestring = formatDate(new Date());
  const response: AxiosResponse<
    ISeatAvailableResponse
  > = await httpClient.get(`/seatavailable/apikey/${key}/trainno/${trainNumber}
  /dateofjourny/${datestring}/source/${source}/destination/${destination}
  /classcode/${classCode}/quota/${quota}/`);

  switch (response.data.ResponseCode) {
    case 404:
      return { data: null, error: "notfound" };
    default:
      return { data: new SeatAvailable(response.data), error: null };
  }
}
