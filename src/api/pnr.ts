/**
 * Exports the getPNRStatus function.
 */

import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";

/**
 * Interface describing the shape of the railwayapi PNR
 * status response. Only the fields we're actually interested in.
 *
 * http://indianrailapi.com/IndianRail/API/PNRCheck
 */
interface IPNRResponse {
  // The API response is full of typos, don't blame me.

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
 * Class that takes the API response and makes an
 * object describing it.
 */
class PNRStatus {
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
    this.statuses = apiResponse.PassengersList.map(
      passenger => passenger.CurrentStatus
    );
  }
}

type PNRErrorReason = "notfound" | "flushed" | "invalid";

export default async function getPNRStatus(
  pnrNumber: string
): Promise<{ data?: PNRStatus; error?: PNRErrorReason }> {
  const response: AxiosResponse<IPNRResponse> = await httpClient.get(
    `/pnrstatus/apikey/${key}/pnr/${pnrNumber}`
  );

  switch (response.data.ResponceCode) {
    case 404:
      return { data: null, error: "notfound" };
    case 220:
      return { data: null, error: "flushed" };
    case 221:
      return { data: null, error: "invalid" };
    default:
      return { data: new PNRStatus(response.data), error: null };
  }
}
