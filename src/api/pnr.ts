/**
 * Exports the getPNRStatus function and related classes.
 */

import { AxiosResponse } from "axios";
import { httpClient, key } from "./config";

/**
 * Interface describing the shape of the railwayapi PNR
 * status response. Only the fields we're actually interested in.
 *
 * See: https://railwayapi.com/api/#pnr-status
 */
interface IPNRResponse {
  response_code: number;

  doj: string;
  total_passengers: number;

  from_station: {
    name: string;
  };

  to_station: {
    name: string;
  };

  train: {
    name: string;
    number: string;
  };

  passengers: Array<{ current_status: string }>;
}

/**
 * Class describing PNR status.
 */
export class PNRStatus {
  public journeyDate: string;
  public numPassengers: number;
  public fromStation: string;
  public toStation: string;
  public trainName: string;
  public trainNumber: string;
  public statuses: Array<string>;

  constructor(apiResponse: IPNRResponse) {
    this.journeyDate = apiResponse.doj;
    this.numPassengers = apiResponse.total_passengers;
    this.fromStation = apiResponse.from_station.name;
    this.toStation = apiResponse.to_station.name;
    this.trainName = apiResponse.train.name;
    this.trainNumber = apiResponse.train.number;
    this.statuses = apiResponse.passengers.map(passenger => passenger.current_status);
  }
}

// Possible PNR errors.
type PNRErrorReason = "notfound" | "flushed" | "invalid";

/**
 * Class describing PNR errors.
 */
export class PNRError {
  public error: PNRErrorReason;

  constructor(message: PNRErrorReason) {
    this.error = message;
  }
}

/**
 * Talk to the API to get PNR status and return either
 * a PNRStatus object or PNRError object depending on the API response.
 */
export async function getPNRStatus(pnrNumber: string): Promise<PNRStatus | PNRError> {
  const response: AxiosResponse<IPNRResponse> = await httpClient.get(`/pnr-status/pnr/${pnrNumber}/apikey/${key}`);

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
