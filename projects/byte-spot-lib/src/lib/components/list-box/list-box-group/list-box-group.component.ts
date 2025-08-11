import { Component, input } from '@angular/core';

@Component({
    selector: 'ngx-bsa-list-box-group',
    imports: [],
    template: `
        @if (title()) {
            <div class="group-title">{{ title() }}</div>
        }
        <ng-content></ng-content>
  `,
    styleUrl: './list-box-group.component.scss',
})
export class ListBoxGroupComponent {
    title = input<string>();
}
