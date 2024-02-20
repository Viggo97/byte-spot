import { TestBed } from '@angular/core/testing';

import { Language } from '../../enums/language/language.enum';
import { LanguageService } from '../language/language.service';
import { TranslateService } from './translate.service';

describe('TranslateService', () => {
    let service: TranslateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TranslateService);
    });

    it('should translate correct key in English', () => {
        const value = service.translate('global.languageEN');
        expect(value).toEqual('English');
    });

    it('should translate correct key in Polish', () => {
        const languageService = TestBed.inject(LanguageService);
        languageService.setLanguage(Language.POLISH);

        const value = service.translate('global.languageEN');
        expect(value).toEqual('Angielski');
    });

    it('should throw error when key is uncompleted', () => {
        expect(() => {
            service.translate('invalidValue');
        }).toThrowError('One of the keys is invalid. Primary key: invalidValue, Specific key: undefined');
    });

    it('should throw error when primary key was not found', () => {
        expect(() => {
            service.translate('invalidPrimaryKey.languageEN');
        }).toThrowError('Primary key invalidPrimaryKey not found.');
    });

    it('should throw error when specific key was not found', () => {
        expect(() => {
            service.translate('global.specificKey');
        }).toThrowError('Specific key specificKey not found.');
    });
});
