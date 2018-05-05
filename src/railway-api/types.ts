export interface LiveStatus {
  trainName: string;
  trainNumber: string;
  sourceStationName: string;
  destinationStationName: string;
  statusString: string;
}

export interface PnrStatus {
  journeyDate: string;
  fromStation: string;
  toStation: string;
  trainName: string;
  trainNumber: string;
  passengerStatuses: Array<string>;
}

export interface Route {
  trainName: string;
  trainNumber: string;
  stationsOnRoute: Array<string>;
}
