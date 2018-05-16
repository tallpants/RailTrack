/**
 * Exports the trainsBetweenStations function.
 */

import { httpClient, key } from './config';
import { AxiosResponse } from 'axios';

import formatDate from '../utils/formatDate';

/**
 * Interface describing the shape of the API response. Only the fields
 * we're interested in.
 *
 * https://railwayapi.com/api/#train-between-stations
 */

interface ITrainsBetweenStationsResponse {
  response_code: number;
  trains: Array<{
    number: string;
    name: string;
    src_departure_time: string; // Ex: '14:05'
  }>;
}

/**
 * Class that converts the API response data into
 * a more usable object.
 */
class TrainsBetweenStations {
  public trains: Array<{
    trainName: string;
    trainNumber: string;
    departureTime: string;
  }>;

  constructor(apiResponse: ITrainsBetweenStationsResponse) {
    this.trains = apiResponse.trains.map(train => {
      return {
        trainName: train.name,
        trainNumber: train.number,
        departureTime: train.src_departure_time,
      };
    });
  }
}

type TrainsBetweenStationsErrorReason = 'invalidstation';

export default async function getTrainsBetweenStations(
  sourceStationCode: string,
  destinationStationCode: string,
): Promise<{
  data?: TrainsBetweenStations;
  error?: TrainsBetweenStationsErrorReason;
}> {
  const datestring = formatDate(new Date());

  const response: AxiosResponse<
    ITrainsBetweenStationsResponse
  > = await httpClient.get(
    `/between/source/${sourceStationCode}/dest/${destinationStationCode}/date/${datestring}/apikey/${key}/`,
  );

  switch (response.data.response_code) {
    case 200:
      return { data: new TrainsBetweenStations(response.data), error: null };
    default:
      return { data: null, error: 'invalidstation' };
  }
}
