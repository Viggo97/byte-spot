import { Component, input } from '@angular/core';

@Component({
    selector: 'ngx-bsa-label',
    imports: [],
    template: `
      <span [id]="id"><ng-content></ng-content></span>
    `,
    styleUrl: './label.component.scss',
})
export class LabelComponent {
    id = input.required<string>();
}
