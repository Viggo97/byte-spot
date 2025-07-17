import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";

import { languageInterceptor } from '@core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withHashLocation()),
        provideAnimations(),
        provideHttpClient(
            withFetch(),
            withInterceptors([languageInterceptor])
        ),
    ],
};
