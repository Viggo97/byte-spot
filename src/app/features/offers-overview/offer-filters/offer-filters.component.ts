import { Component } from '@angular/core';
import { TranslatePipe } from '@core';

@Component({
    selector: 'bsa-offer-filters',
    standalone: true,
    imports: [
        TranslatePipe,
    ],
    templateUrl: './offer-filters.component.html',
    styleUrl: './offer-filters.component.scss',
})
export class OfferFiltersComponent {

}
