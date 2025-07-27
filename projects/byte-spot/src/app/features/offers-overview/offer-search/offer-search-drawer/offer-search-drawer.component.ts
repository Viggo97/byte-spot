import { Component, DestroyRef, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, skip } from 'rxjs';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';

import { TranslatePipe } from '@core';
import { DrawerComponent, Keycodes } from '@shared';

import { OfferSearchSuggestions } from '../offer-search-suggestions.interface';
import { OfferSearchSuggestionsComponent } from '../offer-search-suggestions/offer-search-suggestions.component';

@Component({
    selector: 'bsa-offer-search-drawer',
    imports: [
        ReactiveFormsModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        TranslatePipe,
        DrawerComponent,
        OfferSearchSuggestionsComponent,
    ],
    templateUrl: 'offer-search-drawer.component.html',
    styleUrls: ['./offer-search-drawer.component.scss'],
})
export class OfferSearchDrawerComponent implements OnInit {
    @Input({ required: true }) form!: FormControl;
    @Input({ required: true }) suggestions$!: Observable<OfferSearchSuggestions[]>;

    @Output() searchOffers = new EventEmitter<void>();

    @ViewChild(DrawerComponent) drawer!: DrawerComponent;
    @ViewChild('drawerInput') drawerInput!: ElementRef<HTMLInputElement>;
    @ViewChild('searchButton') drawerButton!: ElementRef<HTMLButtonElement>;
    @ViewChild(OfferSearchSuggestionsComponent) suggestionsComp!: OfferSearchSuggestionsComponent;
    @ViewChild(OfferSearchSuggestionsComponent, { read: ElementRef }) suggestionsRef!: ElementRef<HTMLElement>;

    private overlay = inject(Overlay);
    private destroyRef = inject(DestroyRef);

    readonly scrollStrategy = this.overlay.scrollStrategies.block();
    suggestions: OfferSearchSuggestions[] = [];
    drawerOpen = false;
    dropdownOpen = false;


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
        this.closeDrawer();
    }

    onSelectSuggestion(suggestion: string): void {
        this.drawerInput.nativeElement.focus();
        this.form.setValue(suggestion, { emitEvent: false });
    }

    openDrawer(): void {
        this.drawerOpen = true;
        setTimeout(() => {
            this.drawerInput.nativeElement.focus();
        });
    }

    closeDrawer(): void {
        this.drawerOpen = false;
    }

    openDropdown(): void {
        this.dropdownOpen = true;
    }

    closeDropdown(): void {
        this.dropdownOpen = false;
    }

    onInputClick(event?: KeyboardEvent): void {
        const code = event?.code as Keycodes;
        if (event && code !== Keycodes.SPACE && code !== Keycodes.ENTER) {
            return;
        }

        if (event?.key === Keycodes.ENTER) {
            event.preventDefault();
        }

        this.openDrawer();
    }

    onOverlayKeydown(event: KeyboardEvent): void {
        if ((event.key as Keycodes) === Keycodes.TAB) {
            if (document.activeElement === this.drawerInput.nativeElement) {
                event.preventDefault();
                this.closeDropdown();
                this.drawerButton.nativeElement.focus();
            }
        }

        if ((event.key as Keycodes) === Keycodes.ARROW_DOWN) {
            if (document.activeElement === this.drawerInput.nativeElement && this.dropdownOpen) {
                this.suggestionsComp.focusFirstElement();
            }
        }

        if ((event.key as Keycodes) === Keycodes.ESCAPE) {
            if (this.suggestionsRef.nativeElement.contains(event.target as HTMLElement)) {
                this.drawerInput.nativeElement.focus();
                this.closeDropdown();
            } else {
                this.drawer.close();
            }
        }
    }
}
