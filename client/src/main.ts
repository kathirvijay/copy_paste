import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, msalInstance } from './app/auth-config';
import { AppComponent } from './app/app.component';



async function initializeMsal() {
  await msalInstance.initialize();
}
initializeMsal().then(() => {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error('err', err));
});
