// Export the intent handler / action for Live Running Status
import { DialogflowApp } from "actions-on-google";
import getLiveStatus from "../api/live-status";
/*
    Extract the trainNumber from the intent, send a request to the API, get
    the live status of the train. If there was an error, respond
    with an error message
*/
export default async function LiveStatusAction(app: DialogflowApp) {
  // Extract the trainNumber from the intent
  const trainNumber: any = app.getArgument("trainNumber");
  // Get the live status of the train
  const response = await getLiveStatus(trainNumber);
  // If there was an error
  if (response.error) {
    app.tell(" Sorry! The train number entered is invalid");
  } else {
    // Build a response with the data recieved
    const { minutesLate, isDeparted, currentStationName } = response.data;
    let location: string;
    let minLate: string;
    /* 
    There are two different responses, if the train is 
    currently at a station or has left the station
*/

    // If the train has left the station
    if (isDeparted) {
      location = `The train has left ${currentStationName}`;
      if (minutesLate > 0) {
        minLate = `It is ${minutesLate} minutes late`;
      } else {
        minLate = `It is on time`;
      }
    } else {
      // If the train is currently at a station
      location = `The train is currently at ${currentStationName}`;
      if (minutesLate > 0) {
        minLate = `It is ${minutesLate} minutes late`;
      } else {
        minLate = `It is on time`;
      }
    }

    app.tell(`<speak> ${location}.${minLate}.</speak>`);
  }
}
