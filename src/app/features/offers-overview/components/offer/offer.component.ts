import { Component, Input } from '@angular/core';
import { Offer } from '@app/features/offers-overview/model/offer.model';

@Component({
    selector: 'bsa-offer',
    standalone: true,
    imports: [],
    templateUrl: './offer.component.html',
    styleUrl: './offer.component.scss',
})
export class OfferComponent {
    @Input({ required: true }) offer!: Offer;
}
