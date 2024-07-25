import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

import { Theme } from '@app/core/enums/theme/theme.enum';
import { ThemeService } from '@app/core/services/theme/theme.service';

import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { DropdownItemComponent } from '@app/shared/components/dropdown/dropdown-item/dropdown-item.component';
import { Language } from '@app/core/enums/language/language.enum';
import { LanguageService } from '@app/core/services/language/language.service';
import { TranslateService } from '@app/core/services/translate/translate.service';

@Component({
    selector: 'bsa-navbar',
    standalone: true,
    imports: [NgClass, CdkConnectedOverlay, CdkOverlayOrigin, DropdownComponent, DropdownItemComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    @ViewChild('languageButton') languageButton: ElementRef<HTMLButtonElement> | null = null;

    darkTheme: boolean = false;
    languageDropdownOpen = false;

    languageOptions: DropdownItem<Language>[] = [
        {
            key: Language.ENGLISH,
            value: Language.ENGLISH,
            label: this.translateService.translate('global.languageEN'),
        },
        {
            key: Language.POLISH,
            value: Language.POLISH,
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

    onSelectOption(option: DropdownItem<Language>): void {
        this.languageService.setLanguage(option.value);
        this.languageDropdownOpen = false;
    }
}
