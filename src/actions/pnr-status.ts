/**
 * Exports the intent handler / action for the PNR status intent.
 */

import { DialogflowApp } from "actions-on-google";
import getPNRStatus from "../api/pnr";

/**
 * Extract the PNR number from the intent, get the PNR status, and respond with a
 * status string -- or if there was an error, respond with a string describing
 * the error.
 */
export default async function pnrStatusAction(app: DialogflowApp) {
  // Extract the PNR number from the intent.
  const pnrNumber: any = app.getArgument("pnr");

  // Try to get the PNR status from the API.
  const response = await getPNRStatus(pnrNumber);

  // If there was an error, respond with a string describing the error.
  if (response.error) {
    switch (response.error) {
      case "flushed":
        app.tell("Sorry, that PNR number has already been flushed.");
        break;
      case "invalid":
        app.tell("Sorry, that isn't a valid PNR number.");
        break;
      case "notfound":
        app.tell(
          "Sorry, I couldn't find any information about this PNR number. Are you sure it's correct?"
        );
    }
  } else {
    // Build a response string with the data from the API response and send it to the user.
    // TODO: Look into refactoring this spaghettij
    const date: string = `This journey is scheduled on <say-as interpret-as="date" format="dmy" detail="1">${
      response.data.journeyDate
    }</say-as>`;

    const route: string = `from ${response.data.fromStation} to ${
      response.data.toStation
    }`;

    const train: string = `in ${
      response.data.trainName
    }. The train number is <say-as interpret-as="characters">${
      response.data.trainNumber
    }</say-as>`;

    let numPassengers: string;
    let statuses: string;

    if (response.data.numPassengers === 1) {
      numPassengers = "There is one passenger";
      statuses = `Status is <say-as interpret-as="characters">${
        response.data.statuses[0]
      }</say-as>`;
    } else {
      numPassengers = `There are ${response.data.numPassengers} passengers`;
      statuses = `Their statuses are ${response.data.statuses
        .map(status => `<say-as interpret-as="characters">${status}</say-as>`)
        .join(", ")}`;
    }

    app.ask(
      `<speak>${date}, ${route}, ${train}. ${numPassengers}. ${statuses}.</speak>`
    );
  }
}
