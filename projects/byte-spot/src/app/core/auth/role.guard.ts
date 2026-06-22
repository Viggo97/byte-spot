import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { first, map } from 'rxjs';
import { TranslateService } from '../translate/translate.service';
import { UserService } from './user/user.service';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const userService = inject(UserService);
    const router = inject(Router);
    const translateService = inject(TranslateService);

    const requiredRoles = route.data['roles'] as string[] | undefined;
    return authService.initialized$.pipe(
        first(),
        map(initialized => {
            const userRole = userService.getUser()?.role;
            const message = translateService.translate('user.notAllowed');
            const queryParams = {errorCode: '403', errorMessage: message};
            return initialized && requiredRoles && userRole && requiredRoles.includes(userRole)
                || router.createUrlTree(['/error'], {queryParams});
        }),
    );
};
