import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { DrawerComponent } from 'ngx-bsl';
import { SvgIconComponent } from '@shared';
import { TranslatePipe } from '../../../translate/translate.pipe';
import { NavbarLanguageSwitchComponent } from '../language-switch/navbar-language-switch.component';
import { NavbarThemeSwitchComponent } from '../theme-switch/navbar-theme-switch.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'bsa-compact-menu-drawer',
    imports: [
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        TranslatePipe,
        DrawerComponent,
        SvgIconComponent,
        NavbarLanguageSwitchComponent,
        NavbarThemeSwitchComponent,
    ],
    templateUrl: './compact-menu-drawer.component.html',
    styleUrl: './compact-menu-drawer.component.scss',
})
class CompactMenuDrawerComponent {
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

export default CompactMenuDrawerComponent;
