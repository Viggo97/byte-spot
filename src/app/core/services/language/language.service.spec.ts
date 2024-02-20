import { TestBed } from '@angular/core/testing';

import { Language } from '../../enums/language/language.enum';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
    let service: LanguageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LanguageService);
    });

    it('should have english as default language', () => {
        service.language$.subscribe((value) => {
            expect(value).toEqual(Language.ENGLISH);
        });
    });

    it('should change language', () => {
        service.setLanguage(Language.POLISH);

        service.language$.subscribe((value) => {
            expect(value).toEqual(Language.POLISH);
        });
    });
});
