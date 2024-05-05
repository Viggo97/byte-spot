import { NgClass } from '@angular/common';
import {
    Component, EventEmitter, HostBinding, Input, Output,
} from '@angular/core';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';

@Component({
    selector: 'bsa-dropdown-item',
    standalone: true,
    imports: [
        NgClass,
    ],
    templateUrl: './dropdown-item.component.html',
    styleUrl: './dropdown-item.component.scss',
})
export class DropdownItemComponent {
    @Input({ required: true }) item!: DropdownItem;

    @Output() selectItem = new EventEmitter<DropdownItem>();

    @HostBinding('tabindex') tabindex = 0;

    @HostBinding('click')
    onSelectItem(): void {
        this.selectItem.emit(this.item);
    }
}
