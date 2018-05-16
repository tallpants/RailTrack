import { httpClient, key } from './config';
import { AxiosResponse } from 'axios';

import formatDate from '../utils/formatDate';

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

type LiveStatusErrorReason = 'notfound' | 'notrunning';

export default async function getLiveStatus(
  trainNumber: string,
): Promise<{ data?: LiveStatus; error?: LiveStatusErrorReason }> {
  const datestring = formatDate(new Date());

  const response: AxiosResponse<ILiveStatusResponse> = await httpClient.get(
    `/live/train/${trainNumber}/date/${datestring}/apikey/${key}/`,
  );

  switch (response.data.response_code) {
    case 200:
      return { data: new LiveStatus(response.data), error: null };
    case 404:
      return { data: null, error: 'notfound' };
    case 210:
      return { data: null, error: 'notrunning' };
  }
}
