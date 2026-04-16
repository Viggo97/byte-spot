import { Component, inject, signal } from '@angular/core';
import { IconMoonComponent, IconSunComponent } from 'ngx-bsl';
import { ThemeService } from '../../../theme/theme.service';
import { Theme } from '../../../theme/theme.enum';
import { TranslatePipe } from '../../../translate/translate.pipe';

@Component({
    selector: 'bsa-navbar-theme-switch',
    imports: [
        IconMoonComponent,
        IconSunComponent,
        TranslatePipe,
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
