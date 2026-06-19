import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslatePipe } from '../../translate/translate.pipe';
import { UserService } from '../../auth/user/user.service';
import { ThemeSwitchComponent } from '../theme-switch/theme-switch.component';
import { LanguageSwitchComponent } from '../language-switch/language-switch.component';
import { SignInSelectComponent } from './sign-in-select/sign-in-select.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { NavbarUserMenuComponent } from './user-menu/navbar-user-menu.component';
import { Roles } from '@app/core/auth/user/role.enum';

@Component({
    selector: 'bsa-navbar',
    imports: [
        NgOptimizedImage,
        RouterLink,
        SidenavComponent,
        ThemeSwitchComponent,
        LanguageSwitchComponent,
        SignInSelectComponent,
        NavbarUserMenuComponent,
        TranslatePipe,
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    private readonly _breakpointObserver = inject(BreakpointObserver);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _userService = inject(UserService);

    compactMode = signal(window.innerWidth < 960);
    protected user = toSignal(this._userService.user$);
    protected isEmployer = computed(() => this.user()?.role === Roles.Employer);

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
