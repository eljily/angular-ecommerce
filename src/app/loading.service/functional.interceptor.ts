import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, finalize, retry } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { environment } from '../../environement/environement';






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
      loadingService.hideLoadingSpinnerWithDelay(0);
    })
  );
};



export const loggingInterceptorFunctional: HttpInterceptorFn = (req, next) => {
  console.log('Request URL: ' + req.url);
  return next(req);
}