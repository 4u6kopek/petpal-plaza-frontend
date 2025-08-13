import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, tap, first } from 'rxjs/operators';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn.pipe(
    first(),
    tap((isLoggedIn) => {
      if (isLoggedIn) router.navigate(['/home']);
    }),
    map((isLoggedIn) => !isLoggedIn)
  );
};
