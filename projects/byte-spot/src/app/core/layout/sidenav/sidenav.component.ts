import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { DrawerComponent } from '@byte-spot-lib';
import { SvgIconComponent } from '@shared';
import { TranslatePipe } from '../../translate/translate.pipe';
import { LanguageSwitchComponent } from '../language-switch/language-switch.component';
import { ThemeSwitchComponent } from '../theme-switch/theme-switch.component';
import { AuthService } from '../../auth/auth.service';
import { SidenavUserMenuComponent } from './user-menu/sidenav-user-menu.component';

@Component({
    selector: 'bsa-sidenav',
    imports: [
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        TranslatePipe,
        DrawerComponent,
        SvgIconComponent,
        LanguageSwitchComponent,
        ThemeSwitchComponent,
        SidenavUserMenuComponent,
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
    private readonly _router = inject(Router);
    private readonly _overlay = inject(Overlay);
    private readonly _authService = inject(AuthService);

    protected readonly scrollStrategy = this._overlay.scrollStrategies.block();

    user = toSignal(this._authService.user$);
    protected drawerOpen = signal(false);

    protected openDrawer(): void {
        this.drawerOpen.set(true);
    }

    protected closeDrawer(): void {
        this.drawerOpen.set(false);
    }

    protected navigate(route: string): void {
        this.closeDrawer();
        void this._router.navigate([route]);
    }
}
