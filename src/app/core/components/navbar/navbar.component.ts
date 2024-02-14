import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { DropdownContainerComponent } from '../../../shared/ui/dropdown-container/dropdown-container.component';
import { LanguageService } from '../../services/language/language.service';
import { Theme } from '../../services/theme/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
    selector: 'bsa-navbar',
    standalone: true,
    imports: [NgClass, DropdownContainerComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    @ViewChild('languageButton') languageButton: ElementRef<HTMLButtonElement> | null = null;

    darkTheme: boolean = false;

    constructor(
        private themeService: ThemeService,
        private languageService: LanguageService,
    ) {
        this.themeService.theme$.subscribe((theme) => {
            this.darkTheme = theme === Theme.DARK;
        });
    }

    onSwitchTheme(): void {
        this.themeService.switchTheme();
    }

    onChangeLanguage(): void {
        this.languageService.openLanguageSelection(this.languageButton!.nativeElement);
    }
}
