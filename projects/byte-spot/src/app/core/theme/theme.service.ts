import { Injectable } from '@angular/core';

import { Theme } from './theme.enum';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly storageKey = 'theme';
    private _theme = Theme.DARK;
    get theme(): Theme {
        return this._theme;
    }

    constructor() {
        this.init();
    }

    private init(): void {
        let theme = this.getThemeFromLocalStorage();

        if (!theme) {
            const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDarkTheme ? Theme.DARK : Theme.LIGHT;
        }

        this._theme = theme;
        this.setThemeClass(theme);
    }

    setTheme(theme: Theme): void {
        this._theme = theme;
        this.setThemeClass(theme);
        this.saveThemeToLocalStorage(theme);
    }

    private setThemeClass(theme: Theme): void {
        document.body.classList.toggle('dark-theme', theme === Theme.DARK);
    }

    private saveThemeToLocalStorage(theme: Theme): void {
        localStorage.setItem(this.storageKey, theme);
    }

    private getThemeFromLocalStorage(): Theme | null {
        const theme = localStorage.getItem(this.storageKey);

        if (!theme || !this.themeValid(theme)) {
            return null;
        }

        return theme;
    }

    private themeValid(theme: string): theme is Theme {
        return Object.values(Theme).includes(theme as Theme);
    }
}
