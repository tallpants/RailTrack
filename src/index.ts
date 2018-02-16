import 'source-map-support/register';

import express from 'express';
import bodyParser from 'body-parser';
import { DialogflowApp } from 'actions-on-google';

const app = express();
app.use(bodyParser.json());

app.post('/dialogflow-webhook', (request, response) => {
  const app = new DialogflowApp({ request, response });
  app.tell('The service is functional!');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
