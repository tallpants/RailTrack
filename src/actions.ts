import { DialogflowApp } from 'actions-on-google';

export function backendStatus(app: DialogflowApp) {
  app.tell('The backend is up!');
}
