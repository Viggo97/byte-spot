import { Component, Input } from '@angular/core';

@Component({
    selector: 'bsa-dropdown-group',
    imports: [],
    template: `
        @if (title) {
            <div class="group-title">{{ title }}</div>
        }
        <ng-content></ng-content>
    `,
    styleUrl: './dropdown-group.component.scss',
})
export class DropdownGroupComponent {
    @Input() title?: string;
}
