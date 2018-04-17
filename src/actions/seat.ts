import { DialogflowApp } from "actions-on-google";
import getSeat from "../api/seat";

export default async function checkSeatAction(app: DialogflowApp) {
  /*
    TODO: A DB access for corresponding values 
  */

  const source: any = app.getArgument("from");
  const destination: any = app.getArgument("to");
  const class_code: any = app.getArgument("class_code");
  const trainNumber: any = app.getArgument("trainNumber");

  const response = await getSeat(source, destination, trainNumber, class_code);

  if (response.error) {
    app.tell("Sorry, I couldn't find seats for the train you specified");
  } else {
    /*
      Build a better response - Only temporarily do this
    */
    let { status, trainName } = response.data;
    let first: any = status[0];
    let second: any = status[1];
    let third: any = status[2];
    if (
      first.includes("AVAILABLE") &&
      second.includes("AVAILABLE") &&
      third.includes("AVAILABLE")
    ) {
      first = first.replace("AVAILABLE", "");
      second = second.replace("AVAILABLE", "");
      third = third.replace("AVAILABLE", "");
    }
    app.ask(
      `There are ${first},${second},${third} seats available in ${trainName} for the next three days.`
    );
  }
}
