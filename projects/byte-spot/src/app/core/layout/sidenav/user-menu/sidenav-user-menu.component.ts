import { Component, DestroyRef, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from '@shared';
import { TranslatePipe } from '../../../translate/translate.pipe';
import { AuthService } from '../../../auth/auth.service';

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
