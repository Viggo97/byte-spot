import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { LanguageService } from '@core';

export function languageInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const lang = inject(LanguageService).language;

    const newReq = req.clone({ headers: req.headers.set('Accept-Language', lang) });
    return next(newReq);
}
