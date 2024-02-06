import { NgForOf } from '@angular/common';
import {
    ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewChildren,
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
    @Input() tabIndex: number = 0;
    @Input({ required: true })
    set options(options: Map<string, string>) {
        this.items = Array.from(options, ([key, value]) => ({ key, value }));
    }

    items: DropdownOption[] = [];

    @Output() selectItem = new EventEmitter<DropdownOption>();

    @ViewChildren('itemRef') itemsRef: QueryList<ElementRef> = new QueryList<ElementRef>();

    index = 0;

    onSelectItem(event: MouseEvent, item: DropdownOption): void {
        event.preventDefault();
        event.stopPropagation();
        this.index = this.items.indexOf(item);
        this.selectItem.emit(item);
    }

    @HostListener('keydown', ['$event'])
    onKeyboardNavigation(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();

        const { code } = event;

        switch (code) {
            case 'ArrowDown':
                this.moveIndexAhead();
                break;
            case 'ArrowUp':
                this.moveIndexBack();
                break;
            case 'Tab':
                this.onTab(event);
                break;
            default:
                break;
        }
    }

    @HostListener('keyup', ['$event'])
    onKeyboardAction(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();

        const { code } = event;

        switch (code) {
            case 'Enter':
                this.handleSelectItemByKeyboard();
                break;
            case 'Space':
                this.handleSelectItemByKeyboard();
                break;
            default:
                break;
        }
    }

    private handleSelectItemByKeyboard(): void {
        const selectedItem = this.items[this.index];
        this.selectItem.emit(selectedItem);
    }

    private moveIndexAhead(): void {
        if (!this.isLastIndex) {
            this.index += 1;
            this.focusItem();
        }
    }

    private moveIndexBack(): void {
        if (!this.isFirstIndex) {
            this.index -= 1;
            this.focusItem();
        }
    }

    private onTab(event: KeyboardEvent): void {
        if (event.shiftKey) {
            this.moveIndexBack();
        } else {
            this.moveIndexAhead();
        }
    }

    private get isFirstIndex(): boolean {
        return this.index === 0;
    }

    private get isLastIndex(): boolean {
        return this.index === this.items.length - 1;
    }

    private focusItem(): void {
        this.itemsRef.get(this.index)?.nativeElement.focus();
        this.itemsRef.get(this.index)?.nativeElement.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center',
        });
    }
}
