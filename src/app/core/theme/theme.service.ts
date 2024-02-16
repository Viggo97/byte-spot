import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Theme } from './theme.enum';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private theme: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(Theme.LIGHT);
    theme$: Observable<Theme> = this.theme.asObservable();
    private readonly storageKey = 'theme';
    constructor() {
        this.init();
    }

    private init(): void {
        const savedTheme = this.getThemeFromLocalStorage();

        if (savedTheme && this.themeValid(savedTheme)) {
            this.theme.next(savedTheme);
        } else {
            const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.theme.next(prefersDarkTheme ? Theme.DARK : Theme.LIGHT);
        }

        this.setThemeClass(this.theme.value);
    }

    switchTheme(): void {
        const newTheme = this.theme.value === Theme.DARK ? Theme.LIGHT : Theme.DARK;
        this.setThemeClass(newTheme);
        this.saveThemeToLocalStorage(newTheme);
        this.theme.next(newTheme);
    }

    private setThemeClass(theme: Theme): void {
        document.body.classList.toggle('dark-theme', theme === Theme.DARK);
    }

    private themeValid(theme: string): boolean {
        return theme === Theme.LIGHT || theme === Theme.DARK;
    }

    private saveThemeToLocalStorage(theme: Theme): void {
        localStorage.setItem(this.storageKey, theme);
    }

    private getThemeFromLocalStorage(): Theme | null {
        return localStorage.getItem(this.storageKey) as Theme | null;
    }
}
