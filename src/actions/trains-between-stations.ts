/**
 * Exports the intent handler / action for the live train status intent.
 */

import { DialogflowApp } from 'actions-on-google';
import getTrainsBetweenStations from '../api/trains-between-stations';

import cities from '../cities';

/**
 * Extract the source and destination station names from the intent, get the trains
 * between the stations and respond with either the trains between stations or error if the
 * source or destination were invalid.
 */
export default async function TrainsBetweenStationsAction(app: DialogflowApp) {
  // Extract the source and destination stations from the intent
  const sourceStationName: any = app.getArgument('sourceStation');
  const destinationStationName: any = app.getArgument('destinationStation');

  // Try to get station codes for cities.
  const sourceStationCode = cities[sourceStationName];
  const destinationStationCode = cities[destinationStationName];
  if (sourceStationCode === undefined || destinationStationCode === undefined) {
    return app.ask(`Sorry, I don't know about that city`);
  }

  // Try to get the trains between stations from the API.
  const response = await getTrainsBetweenStations(
    sourceStationCode,
    destinationStationCode,
  );

  if (response.error) {
    return app.tell(
      `Sorry, this IRCTC service isn't available right now. Please try again later.`,
    );
  }

  const { trains } = response.data;

  let statusString = `There are ${
    trains.length
  } trains between ${sourceStationName} and ${destinationStationName}, including `;

  let index = 0;
  for (const train of trains) {
    if (index > 2) {
      break;
    }
    statusString =
      statusString +
      `${train.trainName} number <say-as interpret-as="characters">${
        train.trainNumber
      }</say-as> departing at <say-as interpret-as="time">${
        train.departureTime
      }</say-as>, `;
    index++;
  }

  app.ask(`<speak>${statusString}</speak>`);
}
