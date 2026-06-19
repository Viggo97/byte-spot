import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TranslateService } from '../translate/translate.service';
import { UserService } from './user/user.service';

export const roleGuard: CanActivateFn = (route) => {
    const userService = inject(UserService);
    const router = inject(Router);
    const translateService = inject(TranslateService);

    const requiredRoles = route.data['roles'] as string[] | undefined;
    const userRole = userService.getUser()?.role;

    if (!requiredRoles || requiredRoles.length === 0 || !userRole || !requiredRoles.includes(userRole)) {
        const message = translateService.translate('user.notAllowed');
        const queryParams = {errorCode: '403', errorMessage: message};
        return router.createUrlTree(['/error'], {queryParams});
    }

    return true;
};
