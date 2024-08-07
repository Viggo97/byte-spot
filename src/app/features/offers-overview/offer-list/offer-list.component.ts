import { Component } from '@angular/core';
import { OfferListItemComponent } from './offer-list-item/offer-list-item.component';

@Component({
    selector: 'bsa-offer-list',
    standalone: true,
    imports: [
        OfferListItemComponent,
    ],
    templateUrl: './offer-list.component.html',
    styleUrl: './offer-list.component.scss',
})
export class OfferListComponent {
}
