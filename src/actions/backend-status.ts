import { DialogflowApp } from 'actions-on-google';

export default function backendStatusAction(app: DialogflowApp) {
  app.ask('The backend is up!');
}
