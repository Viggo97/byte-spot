import { Component, contentChildren, ElementRef, TemplateRef, viewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuItemDirective } from './menu-item.directive';

@Component({
    selector: 'bsl-menu',
    imports: [],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
})
export class MenuComponent {
    readonly templateRef = viewChild.required<TemplateRef<unknown>>('menuTemplate');
    readonly menuItemRefs = contentChildren<MenuItemDirective, ElementRef<HTMLElement>>(
        MenuItemDirective,  { descendants: true, read: ElementRef<HTMLElement> });

    focusedItemIndex: number | null = null;

    private readonly eventTriggered = new Subject<MouseEvent | KeyboardEvent>();
    eventTriggered$ = this.eventTriggered.asObservable();

    focusItem(index: number): void {
        if (index < 0 || index > this.menuItemRefs().length - 1) {
            return;
        }
        this.focusedItemIndex = index;
        this.menuItemRefs()[this.focusedItemIndex]?.nativeElement.focus();
    }

    protected onClick(event: MouseEvent): void {
        this.focusedItemIndex = null;
        this.eventTriggered.next(event);
    }

    protected onKeydown(event: KeyboardEvent): void {
        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            this.handleArrowKeys(event);
            return;
        }

        if (event.code === 'Escape' || event.code === 'Tab') {
            this.focusedItemIndex = null;
            this.eventTriggered.next(event);
        }
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        event.preventDefault();
        const firstItemIndex = 0;
        const lastItemIndex = this.menuItemRefs().length - 1;

        if (event.code === 'ArrowDown') {

            if (this.focusedItemIndex === lastItemIndex) {
                this.focusItem(firstItemIndex);
            } else {
                if (this.focusedItemIndex !== null) {
                    this.focusItem(this.focusedItemIndex + 1);
                }

            }
        } else if (event.code === 'ArrowUp') {
            if (this.focusedItemIndex === 0) {
                this.focusItem(lastItemIndex);
            } else {
                if (this.focusedItemIndex !== null) {
                    this.focusItem(this.focusedItemIndex - 1);
                }
            }
        }
    }
}
