import { Component } from '@angular/core';
import { SkeletonComponent } from 'ngx-bsl';

@Component({
    selector: 'bsa-offer-list-skeleton',
    imports: [
        SkeletonComponent,
        SkeletonComponent,
    ],
    templateUrl: './offer-list-skeleton.component.html',
    styleUrl: './offer-list-skeleton.component.scss',
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class OfferListSkeletonComponent {}
