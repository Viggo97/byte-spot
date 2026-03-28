import { Component, input } from '@angular/core';

@Component({
    selector: 'bsa-offers-details-title',
    imports: [],
    templateUrl: './title.component.html',
    styleUrl: './title.component.scss',
})
export class TitleComponent {
    title = input.required<string>();
    companyId = input.required<string>();
    companyName = input.required<string>();
}
