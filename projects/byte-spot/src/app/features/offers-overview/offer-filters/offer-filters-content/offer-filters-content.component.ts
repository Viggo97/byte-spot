import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TranslatePipe } from '@core';

import { CheckboxComponent, IconComponent, KeyValueControl, SliderComponent, ToggleComponent, ValueControl } from '@shared';

@Component({
    selector: 'bsa-offer-filters-content',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CheckboxComponent,
        IconComponent,
        SliderComponent,
        ToggleComponent,
        TranslatePipe,
    ],
    templateUrl: './offer-filters-content.component.html',
    styleUrl: './offer-filters-content.component.scss',
})
export class OfferFiltersContentComponent {
    @Input({ required: true }) form!: FormGroup;
    @Input({ required: true }) technologies!: KeyValueControl<string, string>[];
    @Input({ required: true }) locations!: ValueControl<string>[];
}
