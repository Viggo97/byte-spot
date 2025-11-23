import { Injectable } from '@angular/core';

import { Language } from './language.enum';

@Injectable({ providedIn: 'root' })
export class LanguageService {
    private readonly storageKey = 'language';
    private _language = Language.ENGLISH;
    get language(): Language {
        return this._language;
    }

    constructor() {
        this.init();
    }

    setLanguage(value: Language) {
        if (value === this._language) {
            return;
        }
        localStorage.setItem(this.storageKey, value);
        window.location.reload();
    }

    private init(): void {
        let language = this.getLanguageFromLocalStorage();
        if (language) {
            this._language = language;
            return;
        }

        const preferredLanguage = window.navigator.language;
        if (preferredLanguage) {
            language = preferredLanguage.includes('en') ? Language.ENGLISH : Language.POLISH;
            this._language = language;
        }
    }

    private getLanguageFromLocalStorage(): Language | null {
        const availableLanguages = Object.values(Language) as string[];
        const language = localStorage.getItem('language');
        if (language && availableLanguages.includes(language)) {
            return language as Language;
        }
        return null;
    }
}
