import { Component } from '@angular/core';

import { IconComponent } from '@app/shared/components/icon/icon.component';

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
