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
  // The API response is full of typos, don't blame me.
  // http://indianrailapi.com/IndianRail/API/PNRCheck

  ResponceCode: number;

  DateOfJourny: string;
  TotalPassenger: number;
  TrainName: string;
  TrainNo: string;

  FromStation: {
    Name: string;
  };

  ToStation: {
    Name: string;
  };

  PassengersList: Array<{ CurrentStatus: string }>;
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
    this.journeyDate = apiResponse.DateOfJourny;
    this.numPassengers = apiResponse.TotalPassenger;
    this.fromStation = apiResponse.FromStation.Name;
    this.toStation = apiResponse.ToStation.Name;
    this.trainName = apiResponse.TrainName;
    this.trainNumber = apiResponse.TrainNo;
    this.statuses = apiResponse.PassengersList.map(passenger => passenger.CurrentStatus);
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
  const response: AxiosResponse<IPNRResponse> = await httpClient.get(`/pnrstatus/apikey/${key}/pnr/${pnrNumber}`);

  switch (response.data.ResponceCode) {
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
