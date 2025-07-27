import { Component, ContentChildren, ElementRef, HostListener, QueryList } from '@angular/core';

import { DropdownOptionComponent } from './dropdown-option/dropdown-option.component';
import { Keycodes } from '../../enums/keycodes.enum';

@Component({
    selector: 'bsa-dropdown',
    standalone: true,
    template: '<ng-content></ng-content>',
    styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
    @ContentChildren(DropdownOptionComponent, { descendants: true, read: ElementRef })
    items!: QueryList<ElementRef<HTMLElement>>;

    private index = 0;

    @HostListener('keydown', ['$event'])
    onKeyboardAction(event: KeyboardEvent): void {
        event.preventDefault();

        const code = event.code as Keycodes;

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
            default:
                break;
        }
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
        const item = this.items.get(this.index)?.nativeElement;
        item?.focus({ preventScroll: true });
        item?.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
        });
    }

    focusFirstElement(): void {
        this.index = 0;
        this.focusItem();
    }
}
