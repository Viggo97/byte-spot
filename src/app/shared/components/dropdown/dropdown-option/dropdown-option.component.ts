import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
    selector: 'bsa-dropdown-option',
    standalone: true,
    template: '<ng-content></ng-content>',
    styleUrl: './dropdown-option.component.scss',
})
export class DropdownOptionComponent<T> {
    @Input({ required: true }) value!: T;

    @Output() selectOption = new EventEmitter<T>();

    @HostBinding('tabindex') tabindex = 0;

    @HostListener('click')
    @HostListener('keydown.enter')
    @HostListener('keydown.space')
    onSelectOption(): void {
        this.selectOption.emit(this.value);
    }
}
