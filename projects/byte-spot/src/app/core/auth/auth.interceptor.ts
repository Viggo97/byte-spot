import { inject } from '@angular/core';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing = false;
const refreshToken = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);

    const clonedReq = req.clone({ withCredentials: true });

    return next(clonedReq).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return handle401Error(clonedReq, next, authService);
            }
            return throwError(() => error);
        }),
    );
};

function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshToken.next(null);

        return authService.refreshToken().pipe(
            switchMap(() => {
                isRefreshing = false;
                refreshToken.next(true);
                return next(request);
            }),
            catchError((err: unknown) => {
                isRefreshing = false;
                refreshToken.next(false);
                authService.logout();
                return throwError(() => err);
            }),
        );
    } else {
        return refreshToken.pipe(
            filter(result => result !== null),
            take(1),
            switchMap(() => next(request)),
        );
    }
}
