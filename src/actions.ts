import { DialogflowApp } from "actions-on-google";

export function backendStatus(app: DialogflowApp): void {
  app.tell("The backend is up!");
}
