import { PublicClientApplication, InteractionType, LogLevel } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../environments/environment';

export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientIdFrontend,
      authority: `https://login.microsoftonline.com/${environment.tenantId}`,
      redirectUri: window.location.origin
    },
    cache: {
      cacheLocation: 'sessionStorage'
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Warning
      }
    }
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['openid', 'profile', environment.apiScope]
    }
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, string[]>();
  protectedResourceMap.set(`${environment.apiBaseUrl}/api/*`, [environment.apiScope]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}