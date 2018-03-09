import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";

interface ILiveStatusResponse {
  ResponseCode: number;

  TrainNumber: string;

  CurrentStation: {
    StationCode: string;
    StationName: string;
    IsDeparted: boolean;
    ScheduleDeparture: string;
    LateInMinute: number;
  };
}

class LiveStatus {
  public trainNumber: string;
  public currentStationName: string;
  public currentStationCode: string;
  public isDeparted: boolean;
  public scheduledDepartureTime: string;
  public minutesLate: number;

  constructor(apiResponse: ILiveStatusResponse) {
    this.trainNumber = apiResponse.TrainNumber;
    this.currentStationName = apiResponse.CurrentStation.StationName;
    this.currentStationCode = apiResponse.CurrentStation.StationCode;
    this.isDeparted = apiResponse.CurrentStation.IsDeparted;
    this.scheduledDepartureTime = apiResponse.CurrentStation.ScheduleDeparture;
    this.minutesLate = apiResponse.CurrentStation.LateInMinute;
  }
}

type LiveStatusErrorReason = "notfound";

export default async function getLiveStatus(
  trainNumber: string
): Promise<{ data?: LiveStatus; error?: LiveStatusErrorReason }> {
  const datestring = formatDate(new Date());

  const response: AxiosResponse<ILiveStatusResponse> = await httpClient.get(
    `/livetrainstatus/apikey/${key}/trainno/${trainNumber}/dateofjourny/${datestring}`
  );

  switch (response.data.ResponseCode) {
    case 404:
      return { data: null, error: "notfound" };
    default:
      return { data: new LiveStatus(response.data), error: null };
  }
}

// Takes a Date object and returns a 'yyyymmdd' date string.
function formatDate(d: Date): string {
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  return `${year}${padZero(month)}${padZero(day)}`;
}

// 9 -> 09, but 13 -> 13
function padZero(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
}
