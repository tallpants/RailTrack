// Enable support for the source maps emitted by the TypeScript compiler
// so that errors and stack traces will point to the right spot in our
// source `.ts` files instead of the compiled `.js` files.
import 'source-map-support/register';

import express from 'express';
import bodyParser from 'body-parser';
import { DialogflowApp, AssistantApp } from 'actions-on-google';
import intentMap from './intent-map';

const app = express();

// Dialogflow's SDK needs request bodies to be parsed as JSON
// before it can use them.
app.use(bodyParser.json());

// Fulfilment webhook
app.post('/dialogflow', (request, response) => {
  const dialogflow = new DialogflowApp({ request, response });

  // Use the map defined in `intent-map.ts` to find and run the
  // appropriate handler function for the request based on the intent.
  dialogflow.handleRequest(intentMap as Map<string, (app: AssistantApp) => any>);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App listening on port ${port}`));
