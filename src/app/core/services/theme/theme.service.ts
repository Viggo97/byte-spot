import { Injectable } from '@angular/core';

import { Theme } from './theme.enum';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    theme: Theme = Theme.LIGHT;
    constructor() {
        this.init();
    }

    private init(): void {
        const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.theme = prefersDarkTheme ? Theme.DARK : Theme.LIGHT;

        if (this.theme === Theme.DARK) {
            document.body.classList.add('dark-theme');
        }
    }
}
