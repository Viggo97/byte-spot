import { I18nLanguageCode } from './i18n-language-code.model';
import { i18nGlobal } from './i18n-global';
import { i18nOffer } from './i18n-offer';

export type I18N = { [key: string]: { [key: string] : I18nLanguageCode } };

export const i18n: I18N = {
    global: i18nGlobal,
    offer: i18nOffer,
};
