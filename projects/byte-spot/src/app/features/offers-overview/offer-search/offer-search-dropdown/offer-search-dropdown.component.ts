import { Component, DestroyRef, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, skip } from 'rxjs';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

import { TranslatePipe } from '@core';
import { ResizeObserverDirective, DropdownComponent, Keycodes } from '@shared';

import { OfferSearchSuggestions } from '../offer-search-suggestions.interface';
import { OfferSearchSuggestionsComponent } from '../offer-search-suggestions/offer-search-suggestions.component';

@Component({
    selector: 'bsa-offer-search-dropdown',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        TranslatePipe,
        ResizeObserverDirective,
        DropdownComponent,
        OfferSearchSuggestionsComponent,
    ],
    templateUrl: './offer-search-dropdown.component.html',
    styleUrl: './offer-search-dropdown.component.scss',
})
export class OfferSearchDropdownComponent implements OnInit {
    @Input({ required: true }) form!: FormControl<string>;
    @Input({ required: true }) suggestions$!: Observable<OfferSearchSuggestions[]>;

    @Output() search = new EventEmitter<void>();

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(OfferSearchSuggestionsComponent) suggestionsComp!: OfferSearchSuggestionsComponent;
    @ViewChild(OfferSearchSuggestionsComponent, { read: ElementRef }) suggestionsRef!: ElementRef<HTMLElement>;

    suggestions: OfferSearchSuggestions[] = [];
    dropdownOpen = false;
    dropdownWidth = '';

    constructor(
        private renderer: Renderer2,
        private destroyRef: DestroyRef,
    ) {}

    ngOnInit(): void {
        this.suggestions$
            .pipe(
                skip(1),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((suggestions) => {
                this.suggestions = suggestions;
                if (this.suggestions.length) {
                    this.openDropdown();
                } else {
                    this.closeDropdown();
                }
            });
    }

    onSearch(): void {
        this.search.emit();
    }

    onSelectSuggestion(suggestion: string): void {
        this.searchInput.nativeElement.focus();
        this.form.setValue(suggestion, { emitEvent: false });
        this.search.emit();
    }

    openDropdown(): void {
        this.dropdownOpen = true;
    }

    closeDropdown(): void {
        this.dropdownOpen = false;
    }

    onOutsideClick($event: MouseEvent): void {
        if ($event.target === this.searchInput.nativeElement) {
            return;
        }

        this.closeDropdown();
    }

    onOverlayKeydown(event: KeyboardEvent): void {
        if (event.key === Keycodes.TAB) {
            if (document.activeElement !== this.searchInput.nativeElement) {
                this.searchInput.nativeElement.focus();
            }
            this.closeDropdown();
        }

        if (event.key === Keycodes.ARROW_DOWN) {
            event.preventDefault();
            if (document.activeElement === this.searchInput.nativeElement && this.dropdownOpen) {
                this.suggestionsComp.focusFirstElement();
            }
        }

        if (event.key === Keycodes.ESCAPE) {
            if (document.activeElement !== this.searchInput.nativeElement) {
                this.searchInput.nativeElement.focus();
            }
        }
    }

    get maxDropdownHeight(): string {
        const inputBottomOffset = this.searchInput?.nativeElement.getBoundingClientRect().bottom || 0;
        return `${window.innerHeight - inputBottomOffset - 16}px`;
    }

    onInputResize(entry: ResizeObserverEntry): void {
        this.dropdownWidth = `${entry.borderBoxSize[0].inlineSize}px`;
        if (this.suggestionsRef?.nativeElement) {
            this.renderer.setStyle(this.suggestionsRef.nativeElement, 'width', this.dropdownWidth);
        }
    }
}
