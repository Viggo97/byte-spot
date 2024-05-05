import { Component, Input } from '@angular/core';

@Component({
    selector: 'bsa-dropdown-group',
    standalone: true,
    imports: [],
    templateUrl: './dropdown-group.component.html',
    styleUrl: './dropdown-group.component.scss',
})
export class DropdownGroupComponent {
    @Input() title?: string;
}
