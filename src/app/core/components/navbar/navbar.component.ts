import { Component } from '@angular/core';

import { Theme } from '../../services/theme/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
    selector: 'bsa-navbar',
    standalone: true,
    imports: [],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    darkTheme: boolean = false;

    constructor(private themeService: ThemeService) {
        this.darkTheme = themeService.theme === Theme.DARK;
    }
    switchTheme(): void {
        this.darkTheme = !this.darkTheme;
        this.themeService.theme = this.darkTheme ? Theme.DARK : Theme.LIGHT;
        document.body.classList.toggle('dark-theme');
    }
}
