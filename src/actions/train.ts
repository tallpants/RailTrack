import { DialogflowApp } from "actions-on-google";
import getTrains from "../api/train";

export default async function getTrainsAction(app: DialogflowApp) {
  const source: any = app.getArgument("city1");
  const destination: any = app.getArgument("city2");

  const response = await getTrains(source, destination);

  if (response.error) {
    app.tell("Sorry, I couldn't find trains between the stations");
  } else {
    const { total, trainName } = response.data;
    const number = total;

    const firstTrain: string = trainName[0];
    const secondTrain: string = trainName[1];

    // Improve response
    app.ask(
      `There are ${number} of trains going from ${source} to ${destination}.${firstTrain},${secondTrain} are among them.`
    );
  }
}
