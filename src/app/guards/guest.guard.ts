import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const guestGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  try {
    const isLoggedIn = await firstValueFrom(
      timer(0, 100).pipe(switchMap(() => authService.isLoggedIn))
    );
    console.log('Guest guard: isLoggedIn =', isLoggedIn);
    if (isLoggedIn) {
      router.navigate(['/home'], { replaceUrl: true });
      return false;
    }
    return true;
  } catch (error) {
    console.error('Guest guard error:', error);
    return true;
  }
};
