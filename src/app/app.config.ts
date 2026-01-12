import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  importProvidersFrom
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import {
  provideAppCheck,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  CustomProvider,
} from '@angular/fire/app-check';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    provideAppCheck(() => {
      if (typeof (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN === 'undefined') {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = '709bfafe-b572-498e-85fa-fa0893ec1ad4';
  }
      const provider = environment.production
        ? new ReCaptchaEnterpriseProvider('dummy-key')
        : new CustomProvider({
            getToken: () =>
              Promise.resolve({
                token: '709bfafe-b572-498e-85fa-fa0893ec1ad4',
                expireTimeMillis: Date.now() + 3600000,
              }),
          });
      return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    }),
  ],
};
