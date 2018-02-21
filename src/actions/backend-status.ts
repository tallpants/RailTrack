import { DialogflowApp } from "actions-on-google";

/**
 * TODO:
 */
export default function backendStatusAction(app: DialogflowApp): void {
  app.tell("The backend is up!");
}
