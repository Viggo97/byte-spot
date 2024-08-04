import {
    Component, DestroyRef, ElementRef, OnInit, Renderer2, ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import {
    debounceTime, distinctUntilChanged, Observable, skip, startWith, switchMap, tap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Keycodes } from '@app/shared/enums/keycodes/keycodes.enum';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';

import { OffersService } from '@app/features/offers-overview/offers.service';
import { ResizeObserverDirective } from '@app/shared/directvies/resize-observer.directive';
import { OfferSearchSuggestionsGroup } from './offer-search-suggestions/model/offer-search-suggestion-group.model';
import { OfferSearchSuggestionsComponent } from './offer-search-suggestions/offer-search-suggestions.component';

enum SearchMode {
    DRAWER = 'drawer',
    DROPDOWN = 'dropdown',
}

@Component({
    selector: 'bsa-offer-search',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        DrawerComponent,
        OfferSearchSuggestionsComponent,
        ResizeObserverDirective,
    ],
    templateUrl: './offer-search.component.html',
    styleUrl: './offer-search.component.scss',
})
export class OfferSearchComponent implements OnInit {
    form = new FormControl<string>('', { nonNullable: true });
    suggestions: OfferSearchSuggestionsGroup[] = [];

    searchMode: SearchMode | null = null;
    drawerOpen = false;
    drawerDropdownOpen = true;
    dropdownOpen = false;
    dropdownWidth = '';

    readonly scrollStrategy = this.overlay.scrollStrategies.block();
    readonly SearchMode = SearchMode;

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(DrawerComponent) drawerRef!: DrawerComponent;
    @ViewChild('drawerInput') drawerInput!: ElementRef<HTMLInputElement>;
    @ViewChild('drawerButton') drawerButton!: ElementRef<HTMLButtonElement>;
    @ViewChild('dropdownSuggestions') dropdownSuggestions!: OfferSearchSuggestionsComponent;
    @ViewChild('drawerSuggestions') drawerSuggestions!: OfferSearchSuggestionsComponent;
    @ViewChild('dropdownSuggestions', { read: ElementRef }) dropdownSuggestionsRef!: ElementRef<HTMLInputElement>;
    @ViewChild('drawerSuggestions', { read: ElementRef }) drawerSuggestionsRef!: ElementRef<HTMLInputElement>;

    constructor(
        private destroyRef: DestroyRef,
        private renderer: Renderer2,
        private breakpointObserver: BreakpointObserver,
        private overlay: Overlay,
        protected offersService: OffersService,
    ) {
        this.breakpointObserver.observe('(min-width: 960px)').subscribe((state) => {
            this.searchMode = state.matches ? SearchMode.DROPDOWN : SearchMode.DRAWER;
            this.closeDrawer();
            this.closeDropdown();
        });
    }

    ngOnInit(): void {
        this.form.valueChanges
            .pipe(
                startWith(''),
                debounceTime(150),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.fetchSuggestions(searchTerm)),
                tap((suggestions) => {
                    this.suggestions = suggestions;
                }),
                skip(1),
                tap(() => {
                    if (this.isDrawerMode) {
                        this.openDrawerDropdown();
                    } else {
                        this.openDropdown();
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            ).subscribe();
    }

    private fetchSuggestions(searchTerm: string): Observable<OfferSearchSuggestionsGroup[]> {
        return this.offersService.getSearchSuggestions(searchTerm);
    }

    onSuggestionSelected(suggestion: DropdownItem<string>): void {
        const searchTerm = suggestion.value;
        this.form.setValue(searchTerm, { emitEvent: false });
        this.fetchSuggestions(searchTerm)
            .subscribe((suggestions) => {
                this.suggestions = suggestions;
            });
    }

    // Drawer handlers
    get isDrawerMode(): boolean {
        return this.searchMode === SearchMode.DRAWER;
    }

    openDrawer(): void {
        this.drawerOpen = true;
    }

    closeDrawer(): void {
        this.drawerOpen = false;
    }

    openDrawerDropdown(): void {
        this.drawerDropdownOpen = true;
    }

    closeDrawerDropdown(): void {
        this.drawerDropdownOpen = false;
    }

    onInputClick(event?: KeyboardEvent): void {
        if (!this.isDrawerMode) {
            return;
        }

        if (event && event?.code !== Keycodes.SPACE && event?.code !== Keycodes.ENTER) {
            return;
        }

        if (event?.key === Keycodes.ENTER) {
            event.preventDefault();
        }

        this.openDrawer();
    }

    onOverlayKeydownDrawer(event: KeyboardEvent): void {
        if (!this.isDrawerMode) {
            return;
        }

        if (event.key === Keycodes.TAB) {
            if (document.activeElement === this.drawerInput.nativeElement) {
                event.preventDefault();
                this.closeDrawerDropdown();
                this.drawerButton.nativeElement.focus();
            }
        }

        if (event.key === Keycodes.ARROW_DOWN) {
            if (document.activeElement === this.drawerInput.nativeElement && this.drawerDropdownOpen) {
                this.drawerSuggestions.focusFirstElement();
            }
        }

        if (event.key === Keycodes.ESCAPE) {
            if (this.drawerSuggestionsRef?.nativeElement.contains(event.target as HTMLElement)) {
                this.drawerInput.nativeElement.focus();
                this.closeDrawerDropdown();
            } else {
                this.drawerRef.close();
            }
        }
    }

    // Dropdown handlers
    get isDropdownMode(): boolean {
        return this.searchMode === SearchMode.DROPDOWN;
    }

    openDropdown(): void {
        this.dropdownOpen = true;
    }

    closeDropdown(): void {
        this.dropdownOpen = false;
    }

    onInputFocus(): void {
        if (!this.isDropdownMode) {
            return;
        }

        this.openDropdown();
    }

    onOutsideClick($event: MouseEvent): void {
        if (!this.isDropdownMode) {
            return;
        }

        if ($event.target === this.searchInput.nativeElement) {
            return;
        }

        this.dropdownOpen = false;
    }

    onOverlayKeydownDropdown(event: KeyboardEvent): void {
        if (!this.isDropdownMode) {
            return;
        }

        if (event.key === Keycodes.TAB) {
            if (document.activeElement !== this.searchInput.nativeElement) {
                this.searchInput.nativeElement.focus();
            }
            this.dropdownOpen = false;
        }

        if (event.key === Keycodes.ARROW_DOWN) {
            event.preventDefault();
            if (document.activeElement === this.searchInput.nativeElement && this.dropdownOpen) {
                this.dropdownSuggestions.focusFirstElement();
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
        if (this.dropdownSuggestionsRef?.nativeElement) {
            this.renderer.setStyle(this.dropdownSuggestionsRef.nativeElement, 'width', this.dropdownWidth);
        }
    }
}
