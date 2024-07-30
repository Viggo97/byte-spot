import {
    Component, DestroyRef, ElementRef, OnInit, ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Keycodes } from '@app/shared/enums/keycodes/keycodes.enum';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';

import { OffersService } from '@app/features/offers-overview/offers.service';
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
        DropdownComponent,
        OfferSearchSuggestionsComponent,
    ],
    templateUrl: './offer-search.component.html',
    styleUrl: './offer-search.component.scss',
})
export class OfferSearchComponent implements OnInit {
    searchPhrase = '';

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(DrawerComponent) drawerRef!: DrawerComponent;
    @ViewChild(DropdownComponent) dropdownRef!: DropdownComponent;

    form = new FormControl<string>('', { nonNullable: true });
    suggestions: OfferSearchSuggestionsGroup[] = [];

    searchMode: SearchMode | null = null;
    drawerOpen = false;
    dropdownOpen = false;

    scrollStrategy = this.overlay.scrollStrategies.block();

    constructor(
        private breakpointObserver: BreakpointObserver,
        private overlay: Overlay,
        private destroyRef: DestroyRef,
        protected offersService: OffersService,
    ) {
        this.breakpointObserver.observe('(min-width: 960px)').pipe().subscribe((state) => {
            // skip first run
            if (this.searchMode) {
                // TODO Implement switching between modes
            }
            this.searchMode = state.matches ? SearchMode.DROPDOWN : SearchMode.DRAWER;
        });
    }

    ngOnInit() {
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

    onInputClick(): void {
        if (!this.isDrawerMode) {
            return;
        }

        this.drawerOpen = true;
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
                this.dropdownRef.focusFirstElement();
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
}
