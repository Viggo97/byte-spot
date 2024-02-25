import { TestBed } from '@angular/core/testing';
import { Language } from '@app/core/enums/language/language.enum';
import { LanguageService } from '@app/core/services/language/language.service';

describe('LanguageService', () => {
    let service: LanguageService;

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({});
    });

    it('should set default language based on value from local storage', () => {
        spyOn(localStorage, 'getItem').and.returnValue('en-US');
        service = TestBed.inject(LanguageService);
        service.language$.subscribe((value) => {
            expect(value).toEqual(Language.ENGLISH);
        });
    });

    it('should set English as default language based on system preference', () => {
        spyOn(localStorage, 'getItem').and.returnValue('invalid value');
        spyOnProperty(window.navigator, 'language').and.returnValue('en-US');
        service = TestBed.inject(LanguageService);
        service.language$.subscribe((value) => {
            expect(value).toEqual(Language.ENGLISH);
        });
    });

    it('should set Polish as default language based on system preference', () => {
        spyOn(localStorage, 'getItem').and.returnValue('invalid value');
        spyOnProperty(window.navigator, 'language').and.returnValue('pl-PL');
        service = TestBed.inject(LanguageService);
        service.language$.subscribe((value) => {
            expect(value).toEqual(Language.POLISH);
        });
    });

    it('should set English as default language when value not coming from local storage or system preference', () => {
        spyOn(localStorage, 'getItem').and.returnValue('invalid value');
        spyOnProperty(window.navigator, 'language').and.returnValue(undefined as any);
        service = TestBed.inject(LanguageService);
        service.language$.subscribe((value) => {
            expect(value).toEqual(Language.ENGLISH);
        });
    });

    it('should change language', () => {
        const spy = spyOn(localStorage, 'setItem').and.callThrough();
        spyOnProperty(window.navigator, 'language').and.returnValue('en-US');
        service = TestBed.inject(LanguageService);

        service.setLanguage(Language.POLISH);

        expect(spy).toHaveBeenCalled();
        service.language$.subscribe((value) => {
            expect(value).toEqual(Language.POLISH);
        });
    });

    it('should not change language when it is the same', () => {
        const spy = spyOn(localStorage, 'setItem').and.callThrough();
        spyOnProperty(window.navigator, 'language').and.returnValue('en-US');
        service = TestBed.inject(LanguageService);

        service.setLanguage(Language.ENGLISH);

        expect(spy).not.toHaveBeenCalled();
    });
});
