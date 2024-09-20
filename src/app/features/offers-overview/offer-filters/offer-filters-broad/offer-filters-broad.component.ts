import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslatePipe } from '@core';
import { ControlValue } from '../../types/control-value.type';
import { OfferFiltersContentComponent } from '../offer-filters-content/offer-filters-content.component';

@Component({
    selector: 'bsa-offer-filters-broad',
    standalone: true,
    imports: [
        TranslatePipe,
        OfferFiltersContentComponent,
    ],
    templateUrl: './offer-filters-broad.component.html',
    styleUrl: './offer-filters-broad.component.scss',
})
export class OfferFiltersBroadComponent {
    @Input({ required: true }) form!: FormGroup;
    @Input({ required: true }) technologies!: ControlValue[];
    @Input({ required: true }) locations!: ControlValue[];
}
