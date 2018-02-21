import { DialogflowApp } from "actions-on-google";
import backendStatusAction from "./actions/backend-status";
import pnrStatusAction from "./actions/pnr-status";

type IntentName = string;
type ActionHandler = (app: DialogflowApp) => void;

const backendStatusIntent: IntentName = "BACKEND_STATUS";
const pnrStatusIntent: IntentName = "PNR_STATUS";

/**
 * Mapping from Dialogflow intents (specifically the action name associated
 * with the intent) to handlers defined in `actions.ts`.
 *
 * @example
 * intentMap.set('BACKEND_STATUS', actions.backendStatus);
 * // When the intent's action name is 'BACKEND_STATUS', handle it with
 * // the `backendStatus` function defined in `actions.ts`.
 */
const intentMap: Map<IntentName, ActionHandler> = new Map<IntentName, ActionHandler>();

// Utility intent to check if the backend is up.
intentMap.set(backendStatusIntent, backendStatusAction);

// Return the PNR status for the PNR supplied by the user.
intentMap.set(pnrStatusIntent, pnrStatusAction);

export default intentMap;
