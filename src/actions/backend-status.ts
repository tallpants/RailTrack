import { DialogflowApp } from "actions-on-google";

/**
 * Tells the user that this server is up.
 */
export default function backendStatusAction(app: DialogflowApp): void {
  app.tell("The backend is up!");
}
