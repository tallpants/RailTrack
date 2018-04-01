import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";

interface ILiveStatusResponse {
  response_code: number;

  position: string;

  train: {
    number: string;
    name: string;
  };

  route: Array<{ station: { name: string } }>;
}

class LiveStatus {
  trainName: string;
  trainNumber: string;
  statusString: string;
  sourceStationName: string;
  destinationStationName: string;

  constructor(apiResponse: ILiveStatusResponse) {
    this.trainName = apiResponse.train.name;
    this.trainNumber = apiResponse.train.number;

    this.statusString = apiResponse.position;

    const routeArray = apiResponse.route;
    this.sourceStationName = routeArray[0].station.name;
    this.destinationStationName =
      routeArray[routeArray.length - 1].station.name;
  }
}

type LiveStatusErrorReason = "notfound" | "notrunning";

export default async function getLiveStatus(
  trainNumber: string
): Promise<{ data?: LiveStatus; error?: LiveStatusErrorReason }> {
  const datestring = formatDate(new Date());

  const response: AxiosResponse<ILiveStatusResponse> = await httpClient.get(
    `/live/train/${trainNumber}/date/${datestring}/apikey/${key}/`
  );

  switch (response.data.response_code) {
    case 404:
      return { data: null, error: "notfound" };
    case 210:
      return { data: null, error: "notrunning" };
    default:
      return { data: new LiveStatus(response.data), error: null };
  }
}

// Takes a Date object and returns a 'dd-mm-yyyy' date string.
function formatDate(d: Date): string {
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  return `${padZero(day)}-${padZero(month)}-${year}`;
}

// Prepends a 0 if the number is one digit long.
// 9 -> 09, but 13 -> 13
function padZero(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
}
