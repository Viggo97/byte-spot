import { Component, inject, ViewChild } from '@angular/core';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { DrawerComponent } from '@shared';
import { TranslatePipe } from '@core';
import { OfferFiltersComponent } from '@app/features/offers-overview/offer-filters/offer-filters.component';

@Component({
    selector: 'bsa-offer-settings-filters',
    standalone: true,
    imports: [
        CdkOverlayOrigin,
        TranslatePipe,
        CdkConnectedOverlay,
        DrawerComponent,
        OfferFiltersComponent,
    ],
    templateUrl: './offer-settings-filters.component.html',
    styleUrl: './offer-settings-filters.component.scss',
})
export class OfferSettingsFiltersComponent {
    private overlay = inject(Overlay);
    readonly scrollStrategy = this.overlay.scrollStrategies.block();

    drawerOpen = false;

    @ViewChild(DrawerComponent) drawer!: DrawerComponent;

    openDrawer(): void {
        this.drawerOpen = true;
    }

    closeDrawer(): void {
        this.drawerOpen = false;
    }
}
