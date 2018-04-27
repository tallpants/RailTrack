import { DialogflowApp } from 'actions-on-google';
import getLiveStatus from '../api/live-status';

export default async function LiveStatusAction(app: DialogflowApp) {
  const trainNumber: any = app.getArgument('trainNumber');

  const response = await getLiveStatus(trainNumber);

  if (response.error) {
    switch (response.error) {
      case 'notfound':
        return app.tell("Sorry, there's no train with that number.");
      case 'notrunning':
        return app.tell('This train is not running today.');
    }
  }

  let {
    trainName,
    trainNumber: trainno,
    statusString,
    sourceStationName,
    destinationStationName,
  } = response.data;

  statusString = statusString.replace(
    'Train',
    `${trainName} number <say-as interpret-as="characters">${trainno}</say-as>`,
  );

  if (statusString.includes('Source')) {
    statusString = statusString.replace('Source', sourceStationName);
  } else if (statusString.includes('Destination')) {
    statusString = statusString.replace('Destination', destinationStationName);
  }

  app.ask(`<speak>${statusString}</speak>`);
}
