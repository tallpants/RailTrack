/**
 * TODO:
 */

import { AxiosResponse } from "axios";
import { httpClient, key } from "./config";

/**
 * TODO:
 */
export class PNRStatus {
  public journeyDate: string;
  public numPassengers: number;
  public fromStation: string;
  public toStation: string;
  public trainName: string;
  public trainNumber: string;
  public statuses: Array<string>;

  constructor(apiResponse: any) {
    this.journeyDate = apiResponse.doj;
    this.numPassengers = apiResponse.total_passengers;
    this.fromStation = apiResponse.from_station.name;
    this.toStation = apiResponse.to_station.name;
    this.trainName = apiResponse.train.name;
    this.trainNumber = apiResponse.train.number;
    this.statuses = apiResponse.passengers.map((passenger: any) => passenger.current_status);
  }
}

//
type PNRErrorReason = "notfound" | "flushed" | "invalid";

/**
 * TODO:
 */
export class PNRError {
  public error: PNRErrorReason;

  constructor(message: PNRErrorReason) {
    this.error = message;
  }
}

/**
 * TODO:
 */
export async function getPNRStatus(pnrNumber: string): Promise<PNRStatus | PNRError> {
  const response: AxiosResponse<any> = await httpClient.get(`/pnr-status/pnr/${pnrNumber}/apikey/${key}`);

  switch (response.data.response_code) {
    case 404:
      return new PNRError("notfound");
    case 220:
      return new PNRError("flushed");
    case 221:
      return new PNRError("invalid");
    default:
      return new PNRStatus(response.data);
  }
}
