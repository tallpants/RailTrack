//Export the intent handler / action for Route List intent

import { DialogflowApp } from "actions-on-google";
import getRouteList from "../api/route";
/*
    Extract the trainNumber from the intent, send a request to the API, get
    the route list of that particular train. If there was an error, respond 
    with an error message
*/
export default async function routeAction(app: DialogflowApp) {
  // Extract the trainNumber from the intent
  const trainNumber: any = app.getArgument("trainNumber");

  // Get the route list of the train
  const response = await getRouteList(trainNumber);

  // If there was an error
  if (response.error) {
    app.tell("Sorry! The train number entered does not exist");
  } else {
    // Build a response with the data recieved and send it to the user
    const trainName = `The train ${response.data.trainName} `;
    const route = ` passes through the stations ${response.data.route.join(
      ","
    )} `;

    app.tell(`<speak> ${trainName} ${route}.</speak>`);
  }
}
