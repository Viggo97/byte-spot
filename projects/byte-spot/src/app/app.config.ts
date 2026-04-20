import { ApplicationConfig, inject, provideAppInitializer, SecurityContext } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';

import { languageInterceptor , authInterceptor } from '@core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withHashLocation()),
        provideAnimations(),
        provideHttpClient(
            withFetch(),
            withInterceptors([authInterceptor, languageInterceptor]),
        ),
        provideAppInitializer(loadSvgSprite),
    ],
};

function loadSvgSprite()  {
    const http = inject(HttpClient);
    const domSanitizer = inject(DomSanitizer);

    return firstValueFrom(
        http.get('assets/svg-sprite.svg', { responseType: 'text' })
            .pipe(
                tap(sprite => {
                    const div = document.createElement('div');
                    div.id = 'svg-sprite';
                    div.style.display = 'none';
                    div.style.visibility = 'hidden';
                    const trustedSvg = domSanitizer.sanitize(SecurityContext.HTML, sprite);
                    if (!trustedSvg) {
                        return;
                    }
                    div.innerHTML = trustedSvg;
                    document.body.append(div);
                }),
            ),
    );
}
