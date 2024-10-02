import { Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { PaginationComponent } from '@shared';

import { OffersService } from './offers.service';
import { OfferFiltersComponent } from './offer-filters/offer-filters.component';
import { OfferSearchComponent } from './offer-search/offer-search.component';
import { OfferSettingsComponent } from './offer-settings/offer-settings.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferSort } from './enums/offer-sort.enum';

@Component({
    selector: 'bsa-offers-overview',
    standalone: true,
    imports: [
        PaginationComponent,
        OfferFiltersComponent,
        OfferSearchComponent,
        OfferListComponent,
        OfferSettingsComponent,
    ],
    templateUrl: './offers-overview.component.html',
    styleUrl: './offers-overview.component.scss',
})
export class OffersOverviewComponent {
    private breakpointObserver = inject(BreakpointObserver);
    private offersService = inject(OffersService);

    compactMode = window.innerWidth < 960;

    constructor() {
        this.breakpointObserver.observe('(min-width: 960px)').subscribe((state) => {
            this.compactMode = !state.matches;
        });
    }

    onSortChange(offerSort: OfferSort): void {
        console.log(offerSort);
    }

    onPageChange(page: number): void {
        console.log(page);
    }
}
