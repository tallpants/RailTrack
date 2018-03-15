/**
 * Exports the intent handler / action for the train route intent.
 */

import { DialogflowApp } from "actions-on-google";
import getRoute from "../api/route";

/**
 * Extract the train number from the intent, get the route of the train,
 * and respond with the stations on the train route, or an error if the
 * train number was invalid.
 */
export default async function routeAction(app: DialogflowApp) {
  // Extract the trainNumber from the intent
  const trainNumber: any = app.getArgument("trainNumber");

  // Get the route of the train
  const response = await getRoute(trainNumber);

  // An invalid train number is the only possible error.
  if (response.error) {
    app.tell("Sorry, there's no train with that number.");
  } else {
    /*
     * TODO: Only say the name of the train, the source and destination stations,
     * and the number of stations on the route by voice.
     * 
     * Show the actual list of stations the train is passing through as text.
     * 
     * https://developers.google.com/actions/assistant/responses
     */
    const trainName = `The train ${response.data.trainName} `;
    const route = ` passes through the stations ${response.data.stationsOnRoute.join(
      ","
    )} `;

    app.tell(`<speak> ${trainName} ${route}.</speak>`);
  }
}
