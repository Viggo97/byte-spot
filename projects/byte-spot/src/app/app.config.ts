import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { languageInterceptor, authInterceptor } from '@core';
import { routes } from './app.routes';
import { loadSvgSprite } from '@app/core/initializers/load-svg-sprite';
import { signIn } from '@app/core/initializers/refresh-token';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withHashLocation()),
        provideAnimations(),
        provideHttpClient(
            withFetch(),
            withInterceptors([authInterceptor, languageInterceptor]),
        ),
        provideAppInitializer(loadSvgSprite),
        provideAppInitializer(signIn),
    ],
};
