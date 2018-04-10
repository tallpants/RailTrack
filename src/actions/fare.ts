import { DialogflowApp } from "actions-on-google";
import getFare from "../api/fare";

export default async function FareAction(app: DialogflowApp) {
  /*
    TODO: Get the source and destination with a DB Access; classCode and age with a prompt
  */

  const trainNumber: string = "";
  const source: string = "";
  const destination: string = "";
  const classCode: any = app.getArgument("classCode");
  const quota: string = "GN";
  const age: any = app.getArgument("age");

  const response = await getFare(
    trainNumber,
    source,
    destination,
    classCode,
    quota,
    age
  );

  if (response.error) {
    app.tell(`Sorry,Couldn't find the information you were looking for`);
  } else {
    const { Source, Destination, TrainName } = response.data;

    /*
      Build a better response later
      
    */
    const journey: string = ` The journey is from ${Source} to ${Destination} in ${TrainName}`;

    let fares: string;
    let code: string;
    let name: string;

    name = ` For ${response.data.Names.map(name => name)} the fares are `;
    fares = `${response.data.Fares.map(fare => fare)} respectively`;
    code = `${response.data.Codes.map(code => code)}`;

    app.tell(`<speak> ${journey}. ${name}: ${fares}.`);
  }
}
