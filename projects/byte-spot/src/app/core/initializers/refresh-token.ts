import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export function signIn() {
    const authService = inject(AuthService);
    return authService.refreshToken();
}
