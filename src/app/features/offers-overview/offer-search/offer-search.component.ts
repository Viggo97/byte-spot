import {
    Component, DestroyRef, ElementRef, OnInit, Renderer2, ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import {
    debounceTime, distinctUntilChanged, switchMap,
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
    dropdownOpen = false;
    dropdownWidth = '';

    readonly scrollStrategy = this.overlay.scrollStrategies.block();
    readonly SearchMode = SearchMode;

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(DrawerComponent) drawerRef!: DrawerComponent;
    @ViewChild(OfferSearchSuggestionsComponent) suggestionsDropdown!: OfferSearchSuggestionsComponent;
    @ViewChild(OfferSearchSuggestionsComponent, { read: ElementRef }) dropdownElementRef!: ElementRef<HTMLInputElement>;

    constructor(
        private destroyRef: DestroyRef,
        private renderer: Renderer2,
        private breakpointObserver: BreakpointObserver,
        private overlay: Overlay,
        protected offersService: OffersService,
    ) {
        this.breakpointObserver.observe('(min-width: 960px)').pipe().subscribe((state) => {
            this.searchMode = state.matches ? SearchMode.DROPDOWN : SearchMode.DRAWER;
            this.closeDrawer();
            this.closeDropdown();
        });
    }

    ngOnInit(): void {
        this.form.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.offersService.getSearchSuggestions(searchTerm)),
                takeUntilDestroyed(this.destroyRef),
            ).subscribe((suggestions) => {
                this.suggestions = suggestions;
                // TODO fix this - try to not use dropdown logic here
                if (this.isDropdownMode) {
                    this.openDropdown();
                }
            });
    }

    onSuggestionSelected(item: DropdownItem<string>): void {
        this.suggestions = [];
        this.form.setValue(item.value, { emitEvent: false });
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

    onOutsideClick($event: MouseEvent): void {
        if (!this.isDropdownMode) {
            return;
        }

        if ($event.target === this.searchInput.nativeElement) {
            return;
        }

        this.dropdownOpen = false;
    }

    onOverlayKeydown(event: KeyboardEvent): void {
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
                this.suggestionsDropdown.focusFirstElement();
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
        if (this.dropdownElementRef?.nativeElement) {
            this.renderer.setStyle(this.dropdownElementRef.nativeElement, 'width', this.dropdownWidth);
        }
    }
}
