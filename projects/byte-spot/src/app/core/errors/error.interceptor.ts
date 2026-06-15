import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';
import { ServerError } from './server-error.model';
import { BYPASS_ERROR_INTERCEPTOR } from './bypass-error-interceptor.const';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);

    if (req.context.get(BYPASS_ERROR_INTERCEPTOR)) {
        return next(req);
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 400 || error.status === 500) {
                const queryParams = {errorCode: error.status, errorMessage: ''};
                const errorMessage = ServerError.tryParse(error.error);
                queryParams.errorMessage = errorMessage?.reason || '';

                void router.navigate(['/error'], {queryParams});
                return throwError(() => EMPTY);
            }
            return throwError(() => error);
        }));
};
