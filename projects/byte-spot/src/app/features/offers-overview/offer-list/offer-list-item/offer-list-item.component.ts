import { Component, Input } from '@angular/core';

import { IconComponent, NumberFormatterPipe, SkeletonComponent } from '@shared';
import { TranslatePipe } from '@core';
import { OfferPost } from '../../interfaces/offer-post.interface';

@Component({
    selector: 'bsa-offer-list-item',
    imports: [
        IconComponent,
        NumberFormatterPipe,
        SkeletonComponent,
        TranslatePipe,
    ],
    templateUrl: './offer-list-item.component.html',
    styleUrl: './offer-list-item.component.scss'
})
export class OfferListItemComponent {
    @Input() offer?: OfferPost;
}
