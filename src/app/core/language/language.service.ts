import { Injectable } from '@angular/core';
import { Language } from '@app/core/language/language.enum';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private readonly storageKey = 'language';

    private readonly _language: Language;

    get language(): Language {
        return this._language;
    }

    set language(value: Language) {
        if (value === this._language) {
            return;
        }
        localStorage.setItem(this.storageKey, value);
        window.location.reload();
    }

    constructor() {
        this._language = this.getDefaultLanguage();
    }

    private getDefaultLanguage(): Language {
        const languageFromStorage = this.getDefaultLanguageFromLocalStorage();

        if (languageFromStorage) {
            return languageFromStorage;
        }

        const preferredLanguage = window.navigator.language;

        if (preferredLanguage) {
            return preferredLanguage.includes('en') ? Language.ENGLISH : Language.POLISH;
        }

        return Language.ENGLISH;
    }

    private getDefaultLanguageFromLocalStorage(): Language | null {
        const availableLanguages = Object.values(Language) as string[];
        const language = localStorage.getItem('language');
        if (language && availableLanguages.includes(language)) {
            return language as Language;
        }
        return null;
    }
}
