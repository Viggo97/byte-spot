import {
    Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

import { ResizeObserverDirective } from '@app/shared/directvies/resize-observer.directive';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { Keycodes } from '@app/shared/enums/keycodes/keycodes.enum';

import { OfferSearchSuggestionsGroup } from '../offer-search-suggestions/model/offer-search-suggestion-group.model';
import { OfferSearchSuggestionsComponent } from '../offer-search-suggestions/offer-search-suggestions.component';

@Component({
    selector: 'bsa-offer-search-dropdown',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        ResizeObserverDirective,
        DropdownComponent,
        OfferSearchSuggestionsComponent,
    ],
    templateUrl: './offer-search-dropdown.component.html',
    styleUrl: './offer-search-dropdown.component.scss',
})
export class OfferSearchDropdownComponent implements OnInit {
    @Input({ required: true }) form!: FormControl;
    @Input({ required: true }) suggestions!: OfferSearchSuggestionsGroup[];
    @Input() suggestionsLoaded$!: Subject<void>;

    @Output() selectSuggestion = new EventEmitter<string>();

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(OfferSearchSuggestionsComponent) suggestionsComp!: OfferSearchSuggestionsComponent;
    @ViewChild(OfferSearchSuggestionsComponent, { read: ElementRef }) suggestionsRef!: ElementRef<HTMLElement>;

    dropdownOpen = false;
    dropdownWidth = '';

    constructor(private renderer: Renderer2) {}

    ngOnInit(): void {
        this.suggestionsLoaded$.subscribe(() => {
            this.openDropdown();
        });
    }

    onSelectSuggestion(suggestion: DropdownItem<string>): void {
        this.selectSuggestion.emit(suggestion.value);
    }

    onInputFocus(): void {
        this.openDropdown();
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

        this.dropdownOpen = false;
    }

    onOverlayKeydown(event: KeyboardEvent): void {
        if (event.key === Keycodes.TAB) {
            if (document.activeElement !== this.searchInput.nativeElement) {
                this.searchInput.nativeElement.focus();
            }
            this.dropdownOpen = false;
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
        return `${window.innerHeight - this.searchInput.nativeElement.getBoundingClientRect().bottom - 16}px`;
    }

    onInputResize(entry: ResizeObserverEntry): void {
        this.dropdownWidth = `${entry.borderBoxSize[0].inlineSize}px`;
        if (this.suggestionsRef?.nativeElement) {
            this.renderer.setStyle(this.suggestionsRef.nativeElement, 'width', this.dropdownWidth);
        }
    }
}
