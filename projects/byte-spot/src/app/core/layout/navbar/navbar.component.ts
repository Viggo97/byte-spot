import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ThemeSwitchComponent } from '../theme-switch/theme-switch.component';
import { LanguageSwitchComponent } from '../language-switch/language-switch.component';
import { SignInSelectComponent } from './sign-in-select/sign-in-select.component';
import { AuthService } from '../../auth/auth.service';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
    selector: 'bsa-navbar',
    imports: [
        NgOptimizedImage,
        RouterLink,
        SidenavComponent,
        ThemeSwitchComponent,
        LanguageSwitchComponent,
        SignInSelectComponent,
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    private readonly _breakpointObserver = inject(BreakpointObserver);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _authService = inject(AuthService);

    compactMode = signal(window.innerWidth < 960);
    user = toSignal(this._authService.user$);

    constructor() {
        this.subscribeToBreakpointObserver();
    }

    private subscribeToBreakpointObserver(): void {
        this._breakpointObserver.observe('(min-width: 960px)')
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((state) => {
                this.compactMode.set(!state.matches);
            });
    }
}
