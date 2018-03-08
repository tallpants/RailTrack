import backendStatusAction from "./actions/backend-status";
import pnrStatusAction from "./actions/pnr-status";

const backendStatusIntent = "BACKEND_STATUS";
const pnrStatusIntent = "PNR_STATUS";

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

// Utility intent to check if the backend is up.
intentMap.set(backendStatusIntent, backendStatusAction);

// Return the PNR status for the PNR supplied by the user.
intentMap.set(pnrStatusIntent, pnrStatusAction);

export default intentMap;
