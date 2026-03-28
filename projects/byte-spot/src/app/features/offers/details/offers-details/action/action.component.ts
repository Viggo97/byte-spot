import { Component } from '@angular/core';
import { IconBookmarkComponent } from 'ngx-bsl';
import { TranslatePipe } from '@core';

@Component({
    selector: 'bsa-offers-details-action',
    imports: [
        IconBookmarkComponent,
        TranslatePipe,
    ],
    templateUrl: './action.component.html',
    styleUrl: './action.component.scss',
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ActionComponent {}
