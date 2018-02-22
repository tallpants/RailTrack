import { DialogflowApp } from "actions-on-google";
import { getPNRStatus, PNRError, PNRStatus } from "../api/pnr";

/**
 * FIXME: Documentation
 */
export default async function pnrStatusAction(app: DialogflowApp): Promise<void> {
  const pnrNumber: any = app.getArgument("pnr");

  const response = await getPNRStatus(pnrNumber);

  if (response instanceof PNRError) {
    switch (response.error) {
      case "flushed":
        app.tell("Sorry, that PNR number has already been flushed.");
        break;
      case "invalid":
        app.tell("Sorry, that isn't a valid PNR number.");
        break;
      case "notfound":
        app.tell("Sorry, I couldn't find any information about this PNR number. Are you sure it's correct?");
    }
  }

  // TODO: Look into refactoring this spaghetti
  if (response instanceof PNRStatus) {
    const date: string = `This journey is scheduled on <say-as interpret-as="date" format="dmy" detail="1">${
      response.journeyDate
    }</say-as>.`;

    const route: string = `from ${response.fromStation} to ${response.toStation}`;

    const train: string = `in ${response.trainName}. The train number is <say-as interpret-as="characters">${
      response.trainNumber
    }</say-as>`;

    let numPassengers: string;
    let statuses: string;

    if (response.numPassengers === 1) {
      numPassengers = "There is one passenger";
      statuses = `Status is <say-as interpret-as="characters">${response.statuses[0]}</say-as>`;
    } else {
      numPassengers = `There are ${response.numPassengers} passengers`;
      statuses = `Their statuses are ${response.statuses
        .map(status => `<say-as interpret-as="characters">${status}</say-as>`)
        .join(", ")}`;
    }

    app.tell(`<speak>${date}, ${route}, ${train}. ${numPassengers}. ${statuses}.</speak>`);
  }
}
