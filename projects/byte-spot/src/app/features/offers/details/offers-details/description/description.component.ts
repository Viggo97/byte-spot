import { Component, input } from '@angular/core';
import { TranslatePipe } from '@core';

@Component({
    selector: 'bsa-offers-details-description',
    imports: [
        TranslatePipe,
    ],
    templateUrl: './description.component.html',
    styleUrl: './description.component.scss',
})
export class DescriptionComponent {
    technologies = input.required<string[]>();
    description = input.required<string>();
}
