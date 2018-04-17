import { DialogflowApp } from "actions-on-google";
import getFare from "../api/fare";

export default async function checkFareAction(app: DialogflowApp) {
  /* 
    TODO: A DB access for the train number,source and destination codes
  */
  const source: any = app.getArgument("from");
  const destination: any = app.getArgument("to");
  const class_code: any = app.getArgument("class_code");
  const trainNumber: any = app.getArgument("trainNumber");
  const age: any = app.getArgument("age");

  const response = await getFare(
    source,
    destination,
    trainNumber,
    class_code,
    age
  );

  if (response.error) {
    switch (response.error) {
      case "notfound":
        return app.tell(
          "Sorry, the data you were looking for could not be found"
        );
      case "classnotpresent":
        return app.tell(
          "Sorry, the class that you entered is not present in this train."
        );
    }
  } else {
    const { trainName, className, source, destination, fare } = response.data;

    app.ask(
      `The fare for ${trainName}(${className}) from ${source} to ${destination} is ${fare}.`
    );
  }
}
