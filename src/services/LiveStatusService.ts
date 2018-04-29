export interface LiveStatus {
  trainName: string;
  trainNumber: string;
  sourceStationName: string;
  destinationStationName: string;
  statusString: string;
}

export default interface LiveStatusService {
  getLiveStatus(trainNumber: string): Promise<LiveStatus>;
}
