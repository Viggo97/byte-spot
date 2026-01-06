import { Component, input } from '@angular/core';
import { NumberFormatterPipe } from '@shared';
import { OfferPost } from '../models/offer-post.interface';
import { IconCompanyComponent, IconLocationComponent } from 'ngx-bsl';

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
    offer = input.required<OfferPost>();
}
