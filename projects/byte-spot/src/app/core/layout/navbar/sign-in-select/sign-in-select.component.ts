import { Component, inject, signal } from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { TranslatePipe } from '../../../translate/translate.pipe';

@Component({
    selector: 'bsa-sign-in-select',
    imports: [
        TranslatePipe,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        CdkTrapFocus,
    ],
    templateUrl: './sign-in-select.component.html',
    styleUrl: './sign-in-select.component.scss',
})
export class SignInSelectComponent {
    private readonly _overlay = inject(Overlay);
    protected readonly scrollStrategy = this._overlay.scrollStrategies.block();

    protected signInOpen = signal(false);

    protected openSignIn(): void {
        this.signInOpen.set(true);
    }

    protected closeSignIn(): void {
        this.signInOpen.set(false);
    }
}
