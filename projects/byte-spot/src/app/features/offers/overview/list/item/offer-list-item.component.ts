import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconCompanyComponent, IconLocationComponent } from 'ngx-bsl';
import { Offer } from '../models/offer.interface';
import { SalarySplitPipe } from './salary-split.pipe';
import { EmploymentTypeShorthandPipe } from './employment-type-shorthand.pipe';

@Component({
    selector: 'bsa-offer-list-item',
    imports: [
        IconCompanyComponent,
        IconLocationComponent,
        RouterLink,
        SalarySplitPipe,
        EmploymentTypeShorthandPipe,
    ],
    templateUrl: './offer-list-item.component.html',
    styleUrl: './offer-list-item.component.scss',
})
export class OfferListItemComponent {
    offer = input.required<Offer>();
}
