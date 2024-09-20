import { Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { PaginationComponent } from '@shared';

import { OfferFiltersComponent } from './offer-filters/offer-filters.component';
import { OfferSearchComponent } from './offer-search/offer-search.component';
import { OfferSettingsComponent } from './offer-settings/offer-settings.component';
import { OfferListComponent } from './offer-list/offer-list.component';

@Component({
    selector: 'bsa-offers-overview',
    standalone: true,
    imports: [
        OfferFiltersComponent,
        OfferSearchComponent,
        OfferListComponent,
        PaginationComponent,
        OfferSettingsComponent,
    ],
    templateUrl: './offers-overview.component.html',
    styleUrl: './offers-overview.component.scss',
})
export class OffersOverviewComponent {
    private breakpointObserver = inject(BreakpointObserver);

    compactMode!: boolean;

    constructor() {
        this.breakpointObserver.observe('(min-width: 960px)').subscribe((state) => {
            this.compactMode = !state.matches;
        });
    }

    onPageChange(page: number): void {
        console.log(page);
    }
}
