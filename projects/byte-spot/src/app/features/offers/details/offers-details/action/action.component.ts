import { Component } from '@angular/core';
import { TranslatePipe } from '@core';
import { SvgIconComponent } from '@shared';

@Component({
    selector: 'bsa-offers-details-action',
    imports: [
        TranslatePipe,
        SvgIconComponent,
    ],
    templateUrl: './action.component.html',
    styleUrl: './action.component.scss',
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ActionComponent {}
