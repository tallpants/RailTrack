import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";

interface ILiveStatusResponse {
  ResponseCode: number;
  CurrentPosition: string;
  TrainRoute: Array<{ StationName: string }>;
}

class LiveStatus {
  statusString: string;
  sourceStationName: string;
  destinationStationName: string;

  constructor(apiResponse: ILiveStatusResponse) {
    this.statusString = apiResponse.CurrentPosition;

    const routeArray = apiResponse.TrainRoute;
    this.sourceStationName = routeArray[0].StationName;
    this.destinationStationName = routeArray[routeArray.length - 1].StationName;
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

// Prepends a 0 if the number is one digit long.
// 9 -> 09, but 13 -> 13
function padZero(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
}
