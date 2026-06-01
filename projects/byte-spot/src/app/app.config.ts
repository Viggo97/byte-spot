import { ApplicationConfig, inject, provideAppInitializer, provideEnvironmentInitializer } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { languageInterceptor, authInterceptor } from '@core';
import { routes } from './app.routes';
import { loadSvgSprite } from '@app/core/initializers/load-svg-sprite';
import { ThemeService } from '@app/core/theme/theme.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withHashLocation()),
        provideAnimations(),
        provideHttpClient(
            withFetch(),
            withInterceptors([authInterceptor, languageInterceptor]),
        ),
        provideAppInitializer(loadSvgSprite),
        provideEnvironmentInitializer(() => inject(ThemeService)),
    ],
};
