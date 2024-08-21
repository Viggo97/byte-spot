import { Component } from '@angular/core';

import { IconComponent } from '@shared';

@Component({
    selector: 'bsa-offer-list-item',
    standalone: true,
    imports: [
        IconComponent,
    ],
    templateUrl: './offer-list-item.component.html',
    styleUrl: './offer-list-item.component.scss',
})
export class OfferListItemComponent {

}
