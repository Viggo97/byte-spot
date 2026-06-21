import { Component, computed, DestroyRef, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from '@shared';
import { TranslatePipe } from '../../../translate/translate.pipe';
import { AuthService } from '../../../auth/auth.service';
import { Role } from '@app/core/auth/user/role.enum';
import { UserService } from '../../../auth/user/user.service';

@Component({
    selector: 'bsa-sidenav-user-menu',
    imports: [
        SvgIconComponent,
        TranslatePipe,
    ],
    templateUrl: './sidenav-user-menu.component.html',
    styleUrl: './sidenav-user-menu.component.scss',
})
export class SidenavUserMenuComponent {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _router = inject(Router);
    private readonly _authService = inject(AuthService);
    private readonly _userService = inject(UserService);

    protected user = toSignal(this._userService.user$);
    protected isEmployer = computed(() => this.user()?.role === Role.Employer);

    navigate = output();

    protected onNavigate(path: string): void {
        this.navigate.emit();
        void this._router.navigate([path]);
    }

    protected onLogout(): void {
        this._authService
            .logout()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                error: () => void this._router.navigate(['/']),
                complete: () => {
                    this.navigate.emit();
                    void this._router.navigate(['/']);
                },
            });
    }
}
