import { Component, input } from '@angular/core';
import { IconCompanyComponent, IconLocationComponent } from 'ngx-bsl';
import { NumberFormatterPipe } from '@shared';
import { Offer } from '../models/offer.interface';

@Component({
    selector: 'bsa-offer-list-item',
    imports: [
        NumberFormatterPipe,
        IconCompanyComponent,
        IconLocationComponent,
    ],
    templateUrl: './offer-list-item.component.html',
    styleUrl: './offer-list-item.component.scss',
})
export class OfferListItemComponent {
    offer = input.required<Offer>();
}
