import { NgForOf, NgStyle } from '@angular/common';
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
        NgStyle,
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
    @Input() set numberOfVisibleOptions(value: number) {
        this.maxHeight = `${value * this.ITEM_HEIGHT + 2 * this.INNER_CONTAINER_PADDING + 2 * this.BORDER_WIDTH}px`;
    }

    @Output() selectItem = new EventEmitter<DropdownOption>();

    @ViewChildren('itemRef') itemsRef: QueryList<ElementRef> = new QueryList<ElementRef>();

    private readonly ITEM_HEIGHT = 32;
    private readonly INNER_CONTAINER_PADDING = 4;
    private readonly BORDER_WIDTH = 1;
    private index = -1;
    items: DropdownOption[] = [];
    maxHeight = `${5 * this.ITEM_HEIGHT + 2 * this.INNER_CONTAINER_PADDING + 2 * this.BORDER_WIDTH}px`;

    onSelectItem(event: MouseEvent, item: DropdownOption): void {
        event.preventDefault();
        event.stopPropagation();
        this.index = this.items.indexOf(item);
        this.selectItem.emit(item);
    }

    @HostListener('focusin', ['$event'])
    onFocusIn(event: FocusEvent): void {
        if (this.index === -1) {
            const node = event.target as HTMLLIElement;
            this.index = Array.prototype.indexOf.call(node?.parentNode?.childNodes, node);
        }
    }

    @HostListener('focusout')
    onFocusOut(): void {
        this.index = -1;
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
        const item = this.itemsRef.get(this.index)?.nativeElement;
        item.focus({ preventScroll: true });
        item.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
        });
    }
}
