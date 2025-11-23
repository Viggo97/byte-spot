import { Component, inject, signal } from '@angular/core';
import { IconMoonComponent, IconSunComponent } from 'ngx-bsl';
import { ThemeService } from '../../../theme/theme.service';
import { Theme } from '../../../theme/theme.enum';

@Component({
    selector: 'bsa-navbar-theme-switch',
    imports: [
        IconMoonComponent,
        IconSunComponent,
    ],
    templateUrl: './navbar-theme-switch.component.html',
})
export class NavbarThemeSwitchComponent {
    private themeService = inject(ThemeService);

    protected readonly Theme = Theme;
    protected theme = signal(this.themeService.theme);

    onSwitchTheme(): void {
        this.theme.update(previousTheme => previousTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK);
        this.themeService.setTheme(this.theme());
    }
}
