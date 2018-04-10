import { DialogflowApp } from "actions-on-google";
import getSeatAvailable from "../api/seat";

export default async function SeatAvailableAction(app: DialogflowApp) {
  /*
    TODO: Get the source and destination with a DB Access; classCode with a prompt
  */

  const trainNumber: string = "";
  const destination: string = "";
  const source: string = "";
  const classCode: any = app.getArgument("classCode");
  const quota: string = "GN";
  const response = await getSeatAvailable(
    trainNumber,
    source,
    destination,
    classCode,
    quota
  );
  if (response.error) {
    app.tell("Sorry, I couldn't find the information you required");
  } else {
    const { Source, Destination, trainName } = response.data;
    /*
      Try to say something like
      1.'Source' to 'Destination' in 'Train-Name'
      2. Here is the list for the next 6 days 
      3. Date: 4-4-2018  Status: Available 100 ...
    */
    const journey: string = `${Source} to ${Destination} in ${trainName}. 
    Here is the list of seats available for the next 6 days`;

    let statuses: string;
    let dates: string;

    dates = `${response.data.dates.map(dates => dates)}`;
    statuses = `${response.data.statuses.map(status => status)}`;
    if (statuses.includes("AVAILABLE")) {
      statuses.replace("AVAILABLE", "");
    }
    /*
      TODO: Make a better response. There's no '\n'
    */

    app.tell(`<speak>${journey}</speak>: ${statuses}`);
  }
}
