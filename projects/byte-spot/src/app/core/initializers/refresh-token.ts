import { inject } from '@angular/core';
import { AuthService } from '@core';

export function signIn() {
    const authService = inject(AuthService);
    return authService.refreshToken();
}
