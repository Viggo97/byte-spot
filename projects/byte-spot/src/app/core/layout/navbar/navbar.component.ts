import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectButtonComponent, IconComponent } from '@shared';

import { Theme } from '../../theme/theme.enum';
import { ThemeService } from '../../theme/theme.service';
import { Language } from '../../language/language.enum';
import { LanguageService } from '../../language/language.service';
import { TranslateService } from '../../translate/translate.service';

interface LanguageOption { key: Language, label: string }

@Component({
    selector: 'bsa-navbar',
    imports: [FormsModule, SelectButtonComponent, IconComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    darkTheme = false;

    private languageService = inject(LanguageService);
    private themeService = inject(ThemeService);
    private translateService = inject(TranslateService);

    language: Language | undefined;
    languageOptions: LanguageOption[] = [
        {
            key: Language.ENGLISH,
            label: this.translateService.translate('global.languageEN'),
        },
        {
            key: Language.POLISH,
            label: this.translateService.translate('global.languagePL'),
        },
    ];

    constructor() {
        this.themeService.theme$.subscribe((theme) => {
            this.darkTheme = theme === Theme.DARK;
        });
    }

    onSwitchTheme(): void {
        this.themeService.switchTheme();
    }

    onSelectLanguage(language: LanguageOption): void {
        this.language = language.key;
        this.languageService.language = language.key;
    }
}
