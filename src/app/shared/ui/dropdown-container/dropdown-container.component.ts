import { NgForOf } from '@angular/common';
import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, Output,
} from '@angular/core';

import { DropdownOption } from './model/dropdown-option';

@Component({
    selector: 'bsa-dropdown-container',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgForOf,
    ],
    templateUrl: './dropdown-container.component.html',
    styleUrl: './dropdown-container.component.scss',
})
export class DropdownContainerComponent {
    @Input({ required: true })
    set options(options: Map<string, string>) {
        this.items = Array.from(options, ([key, value]) => ({ key, value }));
    }

    items: DropdownOption[] = [];

    @Output() selectItem = new EventEmitter<DropdownOption>();

    onSelectItem(item: DropdownOption): void {
        this.selectItem.emit(item);
    }
}
