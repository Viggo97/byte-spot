import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SelectButtonComponent } from '@app/shared/components/select-button/select-button.component';
import { IconComponent } from '@app/shared/components/icon/icon.component';

import { Theme } from '@app/core/theme/theme.enum';
import { ThemeService } from '@app/core/theme/theme.service';
import { Language } from '@app/core/language/language.enum';
import { LanguageService } from '@app/core/language/language.service';
import { TranslateService } from '@app/core/translate/translate.service';

type LanguageOption = { key: Language, label: string };

@Component({
    selector: 'bsa-navbar',
    standalone: true,
    imports: [FormsModule, SelectButtonComponent, IconComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    darkTheme = false;

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

    constructor(
        private languageService: LanguageService,
        private themeService: ThemeService,
        private translateService: TranslateService,
    ) {
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
