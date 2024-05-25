import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, finalize, retry } from 'rxjs/operators';
import { LoadingService } from './loading.service';

// Server Response Time Interceptor
export const responseTimeInterceptorFunctional: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  return next(req).pipe(
    finalize(() => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      console.log(`Request to ${req.url} took ${responseTime}ms`);      
    })
  );
}

// Loading Spinner Interceptor
export const loadingSpinnerInterceptorFunctional: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.showLoadingSpinner();

  return next(req).pipe(
    finalize(() => {
      loadingService.hideLoadingSpinnerWithDelay(1000);
    })
  );
};


export const retryInterceptorFunctional: HttpInterceptorFn = (req, next) => {
  const maxRetries = 3;

  return next(req).pipe(
    retry(maxRetries),
    catchError((error: HttpErrorResponse) => {
      console.error('Retry Interceptor Functional Error:', error);
      return throwError(()=> error);
    })
  );
};


export const loggingInterceptorFunctional: HttpInterceptorFn = (req, next) => {
  console.log('Request URL: ' + req.url);
  return next(req);
}