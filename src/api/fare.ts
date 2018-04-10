import { httpClient, key } from "./config";
import { AxiosResponse } from "axios";
import { formatDate, padZero } from "./live-status";

interface IFareResponse {
  ResponseCode: number;
  Train: {
    Name: string;
  };
  From: {
    Name: string;
  };
  To: {
    Name: string;
  };
  Fare: {
    Codes: Array<{ Code: string }>;
    Names: Array<{ Name: string }>;
    Fares: Array<{ Fare: string }>;
  };
}
class Fare {
  public Source: string;
  public Destination: string;
  public TrainName: string;
  public Codes: Array<string>;
  public Names: Array<string>;
  public Fares: Array<string>;

  constructor(apiResponse: IFareResponse) {
    this.Source = apiResponse.From.Name;
    this.Destination = apiResponse.From.Name;
    this.Codes = apiResponse.Fare.Codes.map(codes => codes.Code);
    this.Names = apiResponse.Fare.Names.map(names => names.Name);
    this.Fares = apiResponse.Fare.Fares.map(fares => fares.Fare);
  }
}

type FareErrorReason = "notfound";

export default async function getFare(
  trainNumber: string,
  source: string,
  destination: string,
  classCode: string,
  quota: string,
  age: string
): Promise<{ data?: Fare; error?: FareErrorReason }> {
  const datestring = formatDate(new Date());
  const response: AxiosResponse<IFareResponse> = await httpClient.get(
    `/trainfare/apikey/${key}/trainno/${trainNumber}/dateofjourny/${datestring}/
    source/${source}/destination/${destination}/age/${age}/quota/${quota}/classcode/${classCode}/`
  );

  switch (response.data.ResponseCode) {
    case 404:
      return { data: null, error: "notfound" };
    default:
      return { data: new Fare(response.data), error: null };
  }
}
