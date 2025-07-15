import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { TranslatePipe } from '@core';
import { OfferPost } from '../interfaces/offer-post.interface';
import { OfferListItemComponent } from './offer-list-item/offer-list-item.component';

@Component({
    selector: 'bsa-offer-list',
    imports: [
        AsyncPipe,
        OfferListItemComponent,
        TranslatePipe,
    ],
    templateUrl: './offer-list.component.html',
    styleUrl: './offer-list.component.scss'
})
export class OfferListComponent {
    @Input({ required: true }) offers$!: Observable<OfferPost[]>;
    @Input() loading = true;
    @Input() set total(value: number) {
        if (this.initLoad) {
            this.initLoad = false;
            return;
        }
        this.items = [...Array(value).keys()];
    }
    items = [...Array(10).keys()];
    private initLoad = true;
}
