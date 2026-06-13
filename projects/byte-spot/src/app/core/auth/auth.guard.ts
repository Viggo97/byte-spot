import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { first, map } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.initialized$.pipe(
        first(),
        map(initialized => {
            return initialized && authService.isAuthenticated
                || router.createUrlTree(['/sign-in'], { queryParams: { returnUrl: state.url }});
        }),
    );
};
