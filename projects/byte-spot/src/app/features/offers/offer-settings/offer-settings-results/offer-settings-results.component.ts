import { Component, Input } from '@angular/core';

import { TranslatePipe } from '@core';
import { NumberFormatterPipe } from '@shared';

@Component({
    selector: 'bsa-offers-settings-results',
    imports: [
        TranslatePipe,
        NumberFormatterPipe,
    ],
    templateUrl: './offer-settings-results.component.html',
    styleUrl: './offer-settings-results.component.scss',
})
export class OfferSettingsResultsComponent {
    @Input() offersNumber = 0;
}
