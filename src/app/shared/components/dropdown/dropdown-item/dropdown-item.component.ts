import { NgClass } from '@angular/common';
import {
    Component, EventEmitter, HostBinding, HostListener, Input, Output,
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
export class DropdownItemComponent<T> {
    @Input({ required: true }) item!: DropdownItem<T>;

    @Output() selectItem = new EventEmitter<DropdownItem<T>>();

    @HostBinding('tabindex') tabindex = 0;

    @HostListener('click')
    onSelectItem(): void {
        this.selectItem.emit(this.item);
    }
}
