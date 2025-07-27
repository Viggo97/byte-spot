import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { TranslatePipe } from '@core';
import { KeyValueControl, ValueControl } from '@shared';

import { OfferFiltersContentComponent } from '../offer-filters-content/offer-filters-content.component';

@Component({
    selector: 'bsa-offer-filters-broad',
    imports: [
        TranslatePipe,
        OfferFiltersContentComponent,
    ],
    templateUrl: './offer-filters-broad.component.html',
    styleUrl: './offer-filters-broad.component.scss',
})
export class OfferFiltersBroadComponent {
    @Input({ required: true }) form!: FormGroup;
    @Input({ required: true }) technologies!: KeyValueControl<string, string>[];
    @Input({ required: true }) locations!: ValueControl<string>[];

    @Output() filtersReset = new EventEmitter<void>();

    resetFilters(): void {
        this.filtersReset.emit();
    }
}
