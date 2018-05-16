/**
 * Exports the getPNRStatus function.
 */

import { httpClient, key } from './config';
import { AxiosResponse } from 'axios';

/**
 * Interface describing the shape of the railwayapi PNR
 * status response. Only the fields we're actually interested in.
 *
 * https://railwayapi.com/api/#pnr-status
 */
interface IPNRResponse {
  response_code: number;

  doj: string;
  total_passengers: number;

  train: {
    name: string;
    number: string;
  };

  from_station: {
    name: string;
  };

  to_station: {
    name: string;
  };

  passengers: Array<{ current_status: string }>;
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
    this.journeyDate = apiResponse.doj;
    this.numPassengers = apiResponse.total_passengers;
    this.fromStation = apiResponse.from_station.name;
    this.toStation = apiResponse.to_station.name;
    this.trainName = apiResponse.train.name;
    this.trainNumber = apiResponse.train.number;
    this.statuses = apiResponse.passengers.map(
      passenger => passenger.current_status,
    );
  }
}

type PNRErrorReason = 'notfound' | 'flushed' | 'invalid';

export default async function getPNRStatus(
  pnrNumber: string,
): Promise<{ data?: PNRStatus; error?: PNRErrorReason }> {
  const response: AxiosResponse<IPNRResponse> = await httpClient.get(
    `/pnr-status/pnr/${pnrNumber}/apikey/${key}`,
  );

  switch (response.data.response_code) {
    case 200:
      return { data: new PNRStatus(response.data), error: null };
    case 404:
    case 405:
      return { data: null, error: 'notfound' };
    case 220:
      return { data: null, error: 'flushed' };
    case 221:
      return { data: null, error: 'invalid' };
    default:
      return { data: null, error: 'invalid' };
  }
}
