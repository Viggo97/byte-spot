import { Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, skip } from 'rxjs';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

import { TranslatePipe } from '@core';
import { ResizeObserverDirective, Keycodes } from '@shared';

import { OfferSearchSuggestions } from '../offer-search-suggestions.interface';
import { OfferSearchSuggestionsComponent } from '../offer-search-suggestions/offer-search-suggestions.component';

@Component({
    selector: 'bsa-offers-search-dropdown',
    imports: [
        ReactiveFormsModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        TranslatePipe,
        ResizeObserverDirective,
        OfferSearchSuggestionsComponent,
    ],
    templateUrl: './offer-search-dropdown.component.html',
    styleUrl: './offer-search-dropdown.component.scss',
})
export class OfferSearchDropdownComponent implements OnInit {
    @Input({ required: true }) form!: FormControl<string>;
    @Input({ required: true }) suggestions$!: Observable<OfferSearchSuggestions[]>;

    @Output() searchOffers = new EventEmitter<void>();

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(OfferSearchSuggestionsComponent) suggestionsComp!: OfferSearchSuggestionsComponent;
    @ViewChild(OfferSearchSuggestionsComponent, { read: ElementRef }) suggestionsRef!: ElementRef<HTMLElement>;

    private renderer = inject(Renderer2);
    private destroyRef = inject(DestroyRef);

    suggestions: OfferSearchSuggestions[] = [];
    dropdownOpen = false;
    dropdownWidth = '';

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
        this.searchOffers.emit();
    }

    onSelectSuggestion(suggestion: string): void {
        this.searchInput.nativeElement.focus();
        this.form.setValue(suggestion, { emitEvent: false });
        this.searchOffers.emit();
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
        if ((event.key as Keycodes) === Keycodes.TAB) {
            if (document.activeElement !== this.searchInput.nativeElement) {
                this.searchInput.nativeElement.focus();
            }
            this.closeDropdown();
        }

        if ((event.key as Keycodes) === Keycodes.ARROW_DOWN) {
            event.preventDefault();
            if (document.activeElement === this.searchInput.nativeElement && this.dropdownOpen) {
                this.suggestionsComp.focusFirstElement();
            }
        }

        if ((event.key as Keycodes) === Keycodes.ESCAPE) {
            if (document.activeElement !== this.searchInput.nativeElement) {
                this.searchInput.nativeElement.focus();
            }
        }
    }

    get maxDropdownHeight(): string {
        const inputBottomOffset = this.searchInput.nativeElement.getBoundingClientRect().bottom || 0;
        return `${window.innerHeight - inputBottomOffset - 16}px`;
    }

    onInputResize(entry: ResizeObserverEntry): void {
        this.dropdownWidth = `${entry.borderBoxSize[0].inlineSize}px`;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.suggestionsRef?.nativeElement) {
            this.renderer.setStyle(this.suggestionsRef.nativeElement, 'width', this.dropdownWidth);
        }
    }
}
