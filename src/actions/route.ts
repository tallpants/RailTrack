import { DialogflowApp } from 'actions-on-google';
import getRoute from '../api/route';

export default async function routeAction(app: DialogflowApp) {
  const trainNumber: any = app.getArgument('trainNumber');

  const response = await getRoute(trainNumber);

  if (response.error) {
    app.tell("Sorry, there's no train with that number.");
  } else {
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
