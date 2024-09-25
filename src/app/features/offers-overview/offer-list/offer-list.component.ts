import { Component, inject } from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { OffersService } from '../offers.service';
import { OfferListItemComponent } from './offer-list-item/offer-list-item.component';

@Component({
    selector: 'bsa-offer-list',
    standalone: true,
    imports: [
        OfferListItemComponent,
        AsyncPipe,
    ],
    templateUrl: './offer-list.component.html',
    styleUrl: './offer-list.component.scss',
})
export class OfferListComponent {
    private offersService = inject(OffersService);

    offers$ = this.offersService.getOffers();
}
