import { DialogflowApp } from 'actions-on-google';
import getPNRStatus from '../api/pnr';

export default async function pnrStatusAction(app: DialogflowApp) {
  const pnrNumber: any = app.getArgument('pnr');

  const response = await getPNRStatus(pnrNumber);

  if (response.error) {
    switch (response.error) {
      case 'flushed':
        app.tell('Sorry, that PNR number has already been flushed.');
        break;
      case 'invalid':
        app.tell("Sorry, that isn't a valid PNR number.");
        break;
      case 'notfound':
        app.tell(
          "Sorry, I couldn't find any information about this PNR number. Are you sure it's correct?",
        );
    }
  } else {
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
      numPassengers = 'There is one passenger';
      statuses = `Status is <say-as interpret-as="characters">${
        response.data.statuses[0]
      }</say-as>`;
    } else {
      numPassengers = `There are ${response.data.numPassengers} passengers`;
      statuses = `Their statuses are ${response.data.statuses
        .map(status => `<say-as interpret-as="characters">${status}</say-as>`)
        .join(', ')}`;
    }

    app.ask(
      `<speak>${date}, ${route}, ${train}. ${numPassengers}. ${statuses}.</speak>`,
    );
  }
}
