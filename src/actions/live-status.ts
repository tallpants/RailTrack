/**
 * Exports the intent handler / action for the live train status intent.
 */

import { DialogflowApp } from "actions-on-google";
import getLiveStatus from "../api/live-status";

/**
 * Extract the train number from the intent, get the current train status
 * and respond with either a status string or error if the train number
 * was invalid.
 */
export default async function LiveStatusAction(app: DialogflowApp) {
  // Extract the train number from the intent
  const trainNumber: any = app.getArgument("trainNumber");

  // Try to get the train status from the API
  const response = await getLiveStatus(trainNumber);

  // An invalid train number is the only possible error.
  if (response.error) {
    switch (response.error) {
      case "notfound":
        return app.tell("Sorry, there's no train with that number.");
      case "notrunning":
        return app.tell("This train is not running today.");
    }
  }

  /*
   * Examples of possible statusString from API response:
   * 
   * "Train departed from SIRHIND JN(SIR) and late by 16 minutes."
   * "Train has reached Destination and late by 15 minutes."
   * "Train is currently at Source and late by 0 minutes."
   */
  let {
    trainName,
    trainNumber: trainno,
    statusString,
    sourceStationName,
    destinationStationName
  } = response.data;

  statusString = statusString.replace(
    "Train",
    `${trainName} number <say-as interpret-as="characters">${trainno}</say-as>`
  );

  if (statusString.includes("Source")) {
    statusString = statusString.replace("Source", sourceStationName);
  } else if (statusString.includes("Destination")) {
    statusString = statusString.replace("Destination", destinationStationName);
  }

  app.tell(`<speak>${statusString}</speak>`);
}
