// Enable support for the source maps emitted by the TypeScript compiler
// So that errors and stack traces will point to the right spot in our
// Source `.ts` files instead of the compiled `.js` files.
import "source-map-support/register"; // tslint:disable-line

import express from "express";
import bodyParser from "body-parser";
import { DialogflowApp, AssistantApp } from "actions-on-google";
import intentMap from "./intent-map";

const app: express.Express = express();

// Dialogflow's SDK needs request bodies to be parsed as JSON
// Before it can use them.
app.use(bodyParser.json());

// Fulfilment webhook
app.post("/dialogflow", (request: express.Request, response: express.Response) => {
  const dialogflow: DialogflowApp = new DialogflowApp({ request, response });

  // Use the map defined in `intent-map.ts` to find and run the
  // Appropriate handler function for the request based on the intent.
  dialogflow.handleRequest(intentMap as Map<string, (app: AssistantApp) => void>);
});

const defaultPort: number = 8080;
const port: number = Number(process.env.PORT) || defaultPort;
app.listen(port, () => console.log(`App listening on port ${port}`));
