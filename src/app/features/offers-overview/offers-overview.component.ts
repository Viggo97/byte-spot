import { Component } from '@angular/core';

import { OfferFiltersComponent } from '@app/features/offers-overview/offer-filters/offer-filters.component';
import { OfferSearchComponent } from '@app/features/offers-overview/offer-search/offer-search.component';
import { OfferListComponent } from '@app/features/offers-overview/offer-list/offer-list.component';

@Component({
    selector: 'bsa-offers-overview',
    standalone: true,
    imports: [
        OfferFiltersComponent,
        OfferSearchComponent,
        OfferListComponent,
    ],
    templateUrl: './offers-overview.component.html',
    styleUrl: './offers-overview.component.scss',
})
export class OffersOverviewComponent {

}
