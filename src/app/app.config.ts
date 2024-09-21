import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        importProvidersFrom(HttpClientModule),
    ],
};
