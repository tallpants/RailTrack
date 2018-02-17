import { DialogflowApp } from "actions-on-google";
import * as actions from "./actions";

type IntentName = string;
type ActionHandler = (app: DialogflowApp) => any;

/**
 * Mapping from Dialogflow intents (specifically the action name associated
 * with the intent) to handlers defined in `actions.ts`.
 *
 * @example
 * intentMap.set('BACKEND_STATUS', actions.backendStatus);
 * // When the intent's action name is 'BACKEND_STATUS', handle it with
 * // the `backendStatus` function defined in `actions.ts`.
 */
const intentMap: Map<IntentName, ActionHandler> = new Map();

// Utility intent to check if the backend is up.
intentMap.set("BACKEND_STATUS", actions.backendStatus);

export default intentMap;
