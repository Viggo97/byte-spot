import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { Theme } from '../../services/theme/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
    selector: 'bsa-navbar',
    standalone: true,
    imports: [NgClass],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    darkTheme: boolean = false;

    constructor(private themeService: ThemeService) {
        this.themeService.theme$.subscribe((theme) => {
            this.darkTheme = theme === Theme.DARK;
        });
    }

    onSwitchTheme(): void {
        this.themeService.switchTheme();
    }

    onChangeLanguage(): void {
    }
}
