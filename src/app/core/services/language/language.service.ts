import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Language } from '../../enums/language/language.enum';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private language = new BehaviorSubject<Language>(Language.ENGLISH);
    language$ = this.language.asObservable();

    setLanguage(value: Language): void {
        this.language.next(value);
    }
}
