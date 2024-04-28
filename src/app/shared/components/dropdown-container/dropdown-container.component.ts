import { CdkTrapFocus } from '@angular/cdk/a11y';
import { NgForOf, NgStyle } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { getRemValueInPixels } from '@app/core/utils/rem-value';

import { Keycodes } from '../../enums/keycodes/keycodes.enum';
import { DropdownOption } from '../../models/dropdown-container/dropdown-option';

@Component({
    selector: 'bsa-dropdown-container',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgForOf,
        NgStyle,
        CdkTrapFocus,
    ],
    templateUrl: './dropdown-container.component.html',
    styleUrl: './dropdown-container.component.scss',
})
export class DropdownContainerComponent {
    @Input({ required: true }) set options(options: Map<string, string>) {
        this.items = Array.from(options, ([key, value]) => ({ key, value }));
    }

    @Input() tabIndex = 0;

    @Input() set numberOfVisibleOptions(value: number) {
        this.maxHeight = this.calculateMaxHeight(value);
    }

    maxHeight = this.calculateMaxHeight();

    protected items: DropdownOption[] = [];

    @Output() selectOption = new EventEmitter<DropdownOption>();

    @ViewChildren('itemRef') itemsRef = new QueryList<ElementRef<HTMLDivElement>>();

    private index = 0;

    onSelectItem(item: DropdownOption): void {
        this.index = this.items.indexOf(item);
        this.selectOption.emit(item);
    }

    @HostListener('keydown', ['$event'])
    onKeyboardAction(event: KeyboardEvent): void {
        event.preventDefault();

        const { code } = event;

        switch (code) {
            case Keycodes.ARROW_DOWN:
                this.moveIndexAhead();
                break;
            case Keycodes.ARROW_UP:
                this.moveIndexBack();
                break;
            case Keycodes.TAB:
                this.onTab(event);
                break;
            case Keycodes.ENTER:
                this.handleSelectItemByKeyboard();
                break;
            case Keycodes.SPACE:
                this.handleSelectItemByKeyboard();
                break;
            default:
                break;
        }
    }

    private handleSelectItemByKeyboard(): void {
        const selectedItem = this.items[this.index];
        this.selectOption.emit(selectedItem);
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
        item?.focus({ preventScroll: true });
        item?.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
        });
    }

    private calculateMaxHeight(items?: number): string | null {
        if (!items) {
            return null;
        }

        const containerBorder = 1;
        const containerPadding = 4;
        const itemPadding = 6;
        const lineHeight = 1.5;
        return `${
            items * (getRemValueInPixels(lineHeight) + 2 * itemPadding)
            + 2 * containerPadding
            + 2 * containerBorder
        }px`;
    }
}
