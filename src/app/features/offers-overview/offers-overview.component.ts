import { Component } from '@angular/core';

import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';

import { OfferFiltersComponent } from './offer-filters/offer-filters.component';
import { OfferSearchComponent } from './offer-search/offer-search.component';
import { OfferListComponent } from './offer-list/offer-list.component';

@Component({
    selector: 'bsa-offers-overview',
    standalone: true,
    imports: [
        OfferFiltersComponent,
        OfferSearchComponent,
        OfferListComponent,
        PaginationComponent,
    ],
    templateUrl: './offers-overview.component.html',
    styleUrl: './offers-overview.component.scss',
})
export class OffersOverviewComponent {
    onPageChange(page: number): void {
        console.log(page);
    }
}
