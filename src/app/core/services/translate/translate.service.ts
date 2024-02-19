import { Injectable } from '@angular/core';

import { i18nEnglish } from '../../../../assets/i18n/i18n-english';
import { I18N } from '../../models/translate/i18n.model';

@Injectable({
    providedIn: 'root',
})
export class TranslateService {
    private i18n!: I18N;

    constructor() {
        this.i18n = i18nEnglish;
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

        return this.i18n[primaryKey][specificKey];
    }

    private getKeys(key: string): string[] {
        const [primaryKey, specificKey] = key.split(/\.(.*)/);

        if (!primaryKey || !specificKey) {
            throw new Error(`One of the keys is invalid. Primary key: ${primaryKey}, Specific key: ${specificKey}`);
        }

        return [primaryKey, specificKey];
    }
}
