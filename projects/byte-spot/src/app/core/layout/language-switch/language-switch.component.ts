import { Component, inject, signal, OnInit, input } from '@angular/core';
import { ListBoxOptionComponent, SelectComponent } from '@byte-spot-lib';
import { SvgIconComponent } from '@shared';
import { TranslateService } from '../../translate/translate.service';
import { TranslatePipe } from '../../translate/translate.pipe';
import { LanguageService} from '../../language/language.service';
import { Language } from '../../language/language.enum';
import { LanguageOption } from './language-switch-option.interface';

@Component({
    selector: 'bsa-language-switch',
    imports: [
        SelectComponent,
        ListBoxOptionComponent,
        TranslatePipe,
        SvgIconComponent,
        ListBoxOptionComponent,
        SelectComponent,
    ],
    templateUrl: './language-switch.component.html',
})
export class LanguageSwitchComponent implements OnInit {
    private languageService = inject(LanguageService);
    private translateService = inject(TranslateService);

    compactMode = input(true);

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
