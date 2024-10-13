import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';

import { TranslatePipe } from '@core';
import { DrawerComponent, KeyValueControl, ValueControl } from '@shared';

import { OfferFiltersContentComponent } from '../offer-filters-content/offer-filters-content.component';

@Component({
    selector: 'bsa-offer-filters-compact',
    standalone: true,
    imports: [
        CdkConnectedOverlay,
        CdkOverlayOrigin,
        TranslatePipe,
        DrawerComponent,
        OfferFiltersContentComponent,
    ],
    templateUrl: './offer-filters-compact.component.html',
    styleUrl: './offer-filters-compact.component.scss',
})
export class OfferFiltersCompactComponent {
    private overlay = inject(Overlay);

    @Input({ required: true }) form!: FormGroup;
    @Input({ required: true }) technologies!: KeyValueControl<string, string>[];
    @Input({ required: true }) locations!: ValueControl<string>[];

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
