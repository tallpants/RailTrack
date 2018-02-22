import { DialogflowApp } from "actions-on-google";

/**
 * FIXME: Documentation
 */
export default function backendStatusAction(app: DialogflowApp): void {
  app.tell("The backend is up!");
}
