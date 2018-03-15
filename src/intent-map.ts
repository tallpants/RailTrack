import backendStatusAction from "./actions/backend-status";
import pnrStatusAction from "./actions/pnr-status";
import liveStatusAction from "./actions/live-status";
import routeAction from "./actions/route";

const backendStatusIntent = "BACKEND_STATUS";
const pnrStatusIntent = "PNR_STATUS";
const liveStatusIntent = "LIVE_STATUS";
const routeIntent = "ROUTE";

/**
 * Mapping from Dialogflow intents (specifically the action name associated
 * with the intent) to handlers defined in `actions.ts`.
 *
 * @example
 * intentMap.set('BACKEND_STATUS', actions.backendStatus);
 * // When the intent's action name is 'BACKEND_STATUS', handle it with
 * // the `backendStatus` function defined in `actions.ts`.
 */
const intentMap = new Map();

intentMap.set(backendStatusIntent, backendStatusAction); // Utility intent to check if the backend is up.
intentMap.set(pnrStatusIntent, pnrStatusAction);
intentMap.set(liveStatusIntent, liveStatusAction);
intentMap.set(routeIntent, routeAction);

export default intentMap;
