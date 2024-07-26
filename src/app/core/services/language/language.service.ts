import { Injectable } from '@angular/core';
import { Language } from '@app/core/enums/language/language.enum';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private readonly storageKey = 'language';
    private language: BehaviorSubject<Language>;
    language$: Observable<Language>;

    constructor() {
        const lang = this.getDefaultLanguage();
        this.language = new BehaviorSubject<Language>(lang);
        this.language$ = this.language.asObservable();
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

    setLanguage(value: Language): void {
        if (value === this.language.value) {
            return;
        }
        localStorage.setItem(this.storageKey, value);
        this.language.next(value);
        window.location.reload();
    }
}
