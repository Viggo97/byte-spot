import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.user$.pipe(
        take(1),
        map(user => {
            return !!user || router.createUrlTree(['/sign-in'], { queryParams: { returnUrl: state.url }});
        }),
    );
};
