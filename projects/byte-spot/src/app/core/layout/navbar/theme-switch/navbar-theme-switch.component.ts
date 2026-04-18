import { Component, inject, signal } from '@angular/core';
import { SvgIconComponent } from '@shared';
import { ThemeService } from '../../../theme/theme.service';
import { Theme } from '../../../theme/theme.enum';
import { TranslatePipe } from '../../../translate/translate.pipe';

@Component({
    selector: 'bsa-navbar-theme-switch',
    imports: [
        TranslatePipe,
        SvgIconComponent,
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
