export interface PnrStatus {
  journeyDate: string;
  fromStation: string;
  toStation: string;
  trainName: string;
  trainNumber: string;
  passengerStatuses: Array<string>;
}

export default interface PnrService {
  getPnrStatus(pnrNumber: string): Promise<PnrStatus>;
}
