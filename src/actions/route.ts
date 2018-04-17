/**
 * Exports the intent handler / action for the train route intent.
 */

import { DialogflowApp } from 'actions-on-google';
import getRoute from '../api/route';

/**
 * Extract the train number from the intent, get the route of the train,
 * and respond with the stations on the train route, or an error if the
 * train number was invalid.
 */
export default async function routeAction(app: DialogflowApp) {
  // Extract the trainNumber from the intent
  const trainNumber: any = app.getArgument('trainNumber');

  // Get the route of the train
  const response = await getRoute(trainNumber);

  // An invalid train number is the only possible error.
  if (response.error) {
    app.tell("Sorry, there's no train with that number.");
  } else {
    /*
     * The list of stations is too long to display. So we only
     * tell the source, destination, and the mid point.
     *
     * Ex: "Bangalore to Delhi via Mumbai"
     */
    const { trainName, trainNumber, stationsOnRoute } = response.data;

    const source = stationsOnRoute[0];
    const destination = stationsOnRoute[stationsOnRoute.length - 1];
    const midPoint = stationsOnRoute[Math.trunc(stationsOnRoute.length / 2)];
    const numStations = stationsOnRoute.length - 2;

    app.ask(
      `<speak>${trainName} number <say-as interpret-as="characters">${trainNumber}</say-as> goes from ${source} to ${destination}, via ${midPoint}. It passes through ${numStations} stations on the way.</speak>`,
    );
  }
}
