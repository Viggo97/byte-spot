import { Component } from '@angular/core';
import { NavbarThemeSwitchComponent } from './theme-switch/navbar-theme-switch.component';
import { NavbarLanguageSwitchComponent } from './language-switch/navbar-language-switch.component';

@Component({
    selector: 'bsa-navbar',
    imports: [NavbarThemeSwitchComponent, NavbarLanguageSwitchComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class NavbarComponent {}
