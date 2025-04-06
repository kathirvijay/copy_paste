// src/app/auth-config.ts
import { BrowserCacheLocation, Configuration, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MsalInterceptorConfiguration, MsalGuardConfiguration } from '@azure/msal-angular';


import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalInterceptor, MsalService } from '@azure/msal-angular';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export const msalConfig: Configuration = {
  auth: {
    clientId: 'a571bb6d-d255-42a5-b529-e374f96906ca',
    authority: 'https://login.microsoftonline.com/85a8ca59-470d-4352-a0b0-c2e7618a08b0',
    redirectUri: 'http://localhost:4200/login',
    postLogoutRedirectUri: 'http://localhost:4200/login'
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage,
    storeAuthStateInCookie: isIE
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Verbose,         // <-- log everything
      piiLoggingEnabled: true,            // <-- include personally identifiable info (for debugging only)
      loggerCallback: (level, message, containsPii) => {
        // if (containsPii) {
        //   console.log(`[MSAL - PII] ${message}`);
        // } else {
        //   console.log(`[MSAL] ${message}`);
        // }
      }
    }
  }
  
};
// export const MSAL_INSTANCE = new InjectionToken<PublicClientApplication>('MSAL_INSTANCE');


export const msalInstance = new PublicClientApplication(msalConfig);
  



export const msalInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,
  protectedResourceMap: new Map([
    ['https://graph.microsoft.com/v1.0/me', ['user.read']]
  ])
};

export const msalGuardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Redirect,
  authRequest: {
    scopes: ['user.read']
  }
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      BrowserModule
    ),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useValue: msalInstance,
    },
    { provide: MSAL_GUARD_CONFIG, useValue: msalGuardConfig },
    { provide: MSAL_INTERCEPTOR_CONFIG, useValue: msalInterceptorConfig },
    MsalService,
    MsalGuard,
    MsalBroadcastService 
  ],
};
