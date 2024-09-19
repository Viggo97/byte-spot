import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckboxComponent, IconComponent, SliderComponent, ToggleComponent } from '@shared';
import { TranslatePipe } from '@core';
import { ControlValue } from '@app/features/offers-overview/types/control-value.type';

@Component({
    selector: 'bsa-offer-filters-content',
    standalone: true,
    imports: [
        FormsModule,
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
    @Input({ required: true }) technologies!: ControlValue[];
    @Input({ required: true }) locations!: ControlValue[];
    @Input() displayHeader = false;
}
