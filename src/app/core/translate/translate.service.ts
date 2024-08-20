import { Injectable } from '@angular/core';

import { LanguageService } from '../language/language.service';
import { Language } from '../language/language.enum';
import { I18nLanguageCode } from './i18n/i18n-language-code.model';
import { i18n } from './i18n/i18n';

@Injectable({ providedIn: 'root' })
export class TranslateService {
    private readonly i18n = i18n;
    private readonly code: keyof I18nLanguageCode;

    constructor(private languageService: LanguageService) {
        const lang = this.languageService.language;
        this.code = lang === Language.ENGLISH ? 'en' : 'pl';
    }

    translate(key: string): string {
        return this.getTranslation(key);
    }

    private getTranslation(key: string): string {
        const [primaryKey, specificKey] = this.getKeys(key);

        const primaryKeyExists = Object.keys(this.i18n).find((k) => k === primaryKey);

        if (!primaryKeyExists) {
            throw new Error(`Primary key ${primaryKey} not found.`);
        }

        const specificKeyExists = Object.keys(this.i18n[primaryKey]).find((k) => k === specificKey);

        if (!specificKeyExists) {
            throw new Error(`Specific key ${specificKey} not found.`);
        }

        return this.i18n[primaryKey][specificKey][this.code];
    }

    private getKeys(key: string): string[] {
        const [primaryKey, specificKey] = key.split(/\.(.*)/);

        if (!primaryKey || !specificKey) {
            throw new Error(`One of the keys is invalid. Primary key: ${primaryKey}, Specific key: ${specificKey}`);
        }

        return [primaryKey, specificKey];
    }
}
