import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@core';
import { SvgIconComponent } from '@shared';

@Component({
    selector: 'bsa-offers-details-action',
    imports: [
        TranslatePipe,
        SvgIconComponent,
        RouterLink,
    ],
    templateUrl: './action.component.html',
    styleUrl: './action.component.scss',
})
export class ActionComponent {
    offerId = input.required<string>();
    expired = input(false);
}
