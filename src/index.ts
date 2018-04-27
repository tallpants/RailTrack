import 'source-map-support/register';

import dotenv from 'dotenv';
dotenv.config();

import { DialogflowApp } from 'actions-on-google';
import bodyParser from 'body-parser';
import express from 'express';

import * as actions from './actions';

const server = express();
server.use(bodyParser.json());

server.post('/dialogflow', (request, response) => {
  const app = new DialogflowApp({ request, response });

  try {
    app.handleRequest(
      new Map([
        ['BACKEND_STATUS', actions.backendStatusAction],
        ['PNR_STATUS', actions.pnrStatusAction],
        ['LIVE_STATUS', actions.liveStatusAction],
        ['ROUTE', actions.routeAction],
      ]),
    );
  } catch (e) {
    console.error(e.stack);
    app.ask('Sorry, something went wrong, could you ask me that again?');
  }
});

server.get('/ping', (_, response) => response.send('pong'));

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Listening on port ${port}`));
