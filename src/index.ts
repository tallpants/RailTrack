// Enable support for the source maps emitted by the TypeScript compiler
// So that errors and stack traces will point to the right spot in our
// Source `.ts` files instead of the compiled `.js` files.
import "source-map-support/register";

import { DialogflowApp } from "actions-on-google";
import bodyParser from "body-parser";
import express from "express";

import intentMap from "./intent-map";

const server = express();

// Dialogflow's SDK needs request bodies to be parsed as JSON before it can use them.
server.use(bodyParser.json());

// Fulfilment webhook
server.post("/dialogflow", (request, response) => {
  const app = new DialogflowApp({ request, response });

  // Use the map defined in `intent-map.ts` to find and run the appropriate handler
  // function for the request based on the intent.
  app.handleRequest(intentMap);
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Listening on port ${port}`));
