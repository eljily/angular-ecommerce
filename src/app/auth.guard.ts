
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../app/auth/service/auth.service';

export const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("Auth guard checking authentication state...");

  if (authService.isAuthenticated()) {
    console.log("User is authenticated, granting access.");
    return true;
  } else {
    console.log("User is not authenticated, storing redirect URL and redirecting to login.");
    authService.setRedirectUrl(state.url);
    return router.createUrlTree(['/login']);
  }
};