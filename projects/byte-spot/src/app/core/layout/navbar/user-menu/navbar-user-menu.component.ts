import { Component, computed, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MenuComponent, MenuTriggerDirective, MenuItemDirective } from '@byte-spot-lib';
import { SvgIconComponent } from '@shared';
import { TranslatePipe } from '../../../translate/translate.pipe';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../auth/user/user.service';
import { Role } from '@app/core/auth/user/role.enum';

@Component({
    selector: 'bsa-navbar-user-menu',
    imports: [
        MenuTriggerDirective,
        SvgIconComponent,
        MenuComponent,
        MenuItemDirective,
        TranslatePipe,
    ],
    templateUrl: './navbar-user-menu.component.html',
    styleUrl: './navbar-user-menu.component.scss',
})
export class NavbarUserMenuComponent {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _router = inject(Router);
    private readonly _authService = inject(AuthService);
    private readonly _userService = inject(UserService);
    protected user = toSignal(this._userService.user$);
    protected isEmployer = computed(() => this.user()?.role === Role.Employer);

    protected onNavigate(path: string): void {
        void this._router.navigate([path]);
    }

    protected onLogout(): void {
        this._authService
            .logout()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: () => void this._router.navigate(['/']),
                complete: () => void this._router.navigate(['/']),
            });
    }
}
