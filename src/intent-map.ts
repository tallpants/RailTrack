import backendStatusAction from './actions/backend-status';
import pnrStatusAction from './actions/pnr-status';
import liveStatusAction from './actions/live-status';
import trainsBetweenStationsAction from './actions/trains-between-stations';
import routeAction from './actions/route';

/**
 * Mapping from Dialogflow intents (specifically the action name associated
 * with the intent) to handlers defined in `actions.ts`.
 */
const intentMap = new Map();

intentMap.set('BACKEND_STATUS', backendStatusAction);
intentMap.set('PNR_STATUS', pnrStatusAction);
intentMap.set('LIVE_STATUS', liveStatusAction);
intentMap.set('ROUTE', routeAction);
intentMap.set('TRAINS_BETWEEN_STATIONS', trainsBetweenStationsAction);

export default intentMap;
