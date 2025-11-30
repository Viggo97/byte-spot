import { Component, input } from '@angular/core';
import { NumberFormatterPipe } from '@shared';
import { TranslatePipe } from '@core';

@Component({
    selector: 'bsa-offers-overview-info',
    imports: [
        NumberFormatterPipe,
        TranslatePipe,
    ],
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss',
})
export class InfoComponent {
    numberOfOffers = input(0);
}
