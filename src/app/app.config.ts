import { ApplicationConfig, importProvidersFrom } from '@angular/core';


import { HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from './animations-util';
import { loadingSpinnerInterceptorFunctional, loggingInterceptorFunctional, newPrefixInterceptorFunctional, responseTimeInterceptorFunctional } from './loading.service/functional.interceptor';




export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withFetch(),withInterceptors([
    newPrefixInterceptorFunctional,
    loadingSpinnerInterceptorFunctional, 
    responseTimeInterceptorFunctional,
    loggingInterceptorFunctional, ])),
    provideAnimationsAsync(),
    provideToastr(),
  ]
};

