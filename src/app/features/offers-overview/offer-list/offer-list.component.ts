import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { OfferPost } from '../interfaces/offer-post.interface';
import { OfferListItemComponent } from './offer-list-item/offer-list-item.component';

@Component({
    selector: 'bsa-offer-list',
    standalone: true,
    imports: [
        AsyncPipe,
        OfferListItemComponent,
    ],
    templateUrl: './offer-list.component.html',
    styleUrl: './offer-list.component.scss',
})
export class OfferListComponent {
    @Input({ required: true }) offers$!: Observable<OfferPost[]>;
}
