import {
    Directive, ElementRef, HostListener,
} from '@angular/core';
import { Keycodes } from '@app/shared/enums/keycodes/keycodes.enum';

@Directive({
    selector: '[bsaFocusTrap]',
    standalone: true,
})
export class FocusTrapDirective {
    private focusableElements: HTMLElement[] = [];

    constructor(private elementRef: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.code !== Keycodes.TAB) {
            return;
        }
        this.setFocusableElements();
        this.manageFocusableElements(event);
    }

    private setFocusableElements(): void {
        this.focusableElements = [];
        this.focusableElements = Array
            .from(this.elementRef.nativeElement.querySelectorAll('[tabindex]') as HTMLElement[])
            .filter(this.filterFocusableElements)
            .sort((a, b) => a.tabIndex - b.tabIndex);
    }

    private manageFocusableElements(event: KeyboardEvent): void {
        const firstFocusableElement: HTMLElement = this.focusableElements[0];
        const lastFocusableElement: HTMLElement = this.focusableElements[this.focusableElements.length - 1];

        event.stopPropagation();

        if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                event.preventDefault();
            }
        } else if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            event.preventDefault();
        }
    }

    private filterFocusableElements(element: HTMLElement): boolean {
        return element.tabIndex > 0 && !element.getAttribute('disabled') && !element.hidden;
    }
}
