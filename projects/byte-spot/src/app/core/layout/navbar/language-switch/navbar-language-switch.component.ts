import { Component, inject, signal, OnInit } from '@angular/core';
import { IconLanguageComponent, ListBoxOptionComponent, SelectComponent } from 'ngx-bsl';
import { LanguageService} from '../../../language/language.service';
import { Language } from '../../../language/language.enum';
import { LanguageOption } from './navbar-language-switch-option.interface';
import { TranslateService } from '../../../translate/translate.service';

@Component({
    selector: 'bsa-navbar-language-switch',
    imports: [
        IconLanguageComponent,
        SelectComponent,
        ListBoxOptionComponent,
    ],
    templateUrl: './navbar-language-switch.component.html',
})
export class NavbarLanguageSwitchComponent implements OnInit {
    private languageService = inject(LanguageService);
    private translateService = inject(TranslateService);

    protected languageOptions: LanguageOption[] = [
        {
            key: Language.ENGLISH,
            label: this.translateService.translate('global.languageEN'),
        },
        {
            key: Language.POLISH,
            label: this.translateService.translate('global.languagePL'),
        },
    ];

    protected language = signal(this.languageOptions[0]);

    ngOnInit(): void {
        this.setInitialLanguage();
    }

    onSelectLanguage(): void {
        this.languageService.setLanguage(this.language().key);
    }

    private setInitialLanguage(): void {
        const language = this.languageOptions.find(language => language.key === this.languageService.language);
        if (language) {
            this.language.set(language);
        }
    }
}
