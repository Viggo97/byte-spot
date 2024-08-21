import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay } from '@angular/cdk/overlay';

import { TranslatePipe } from '@core';
import { DrawerComponent, Keycodes } from '@shared';

import { OfferSearchSuggestionsGroup } from '../offer-search-suggestions/model/offer-search-suggestion-group.model';
import { OfferSearchSuggestionsComponent } from '../offer-search-suggestions/offer-search-suggestions.component';

@Component({
    selector: 'bsa-offer-search-drawer',
    standalone: true,
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
    @Input({ required: true }) suggestions!: OfferSearchSuggestionsGroup[];
    @Input() suggestionsLoaded$!: Subject<void>;

    @Output() selectSuggestion = new EventEmitter<string>();

    @ViewChild(DrawerComponent) drawer!: DrawerComponent;
    @ViewChild('drawerInput') drawerInput!: ElementRef<HTMLInputElement>;
    @ViewChild('searchButton') drawerButton!: ElementRef<HTMLButtonElement>;
    @ViewChild(OfferSearchSuggestionsComponent) suggestionsComp!: OfferSearchSuggestionsComponent;
    @ViewChild(OfferSearchSuggestionsComponent, { read: ElementRef }) suggestionsRef!: ElementRef<HTMLElement>;

    readonly scrollStrategy = this.overlay.scrollStrategies.block();
    drawerOpen = false;
    dropdownOpen = true;

    constructor(private overlay: Overlay) { }

    ngOnInit(): void {
        this.suggestionsLoaded$.subscribe(() => {
            this.openDropdown();
        });
    }

    onSelectSuggestion(suggestion: string): void {
        this.selectSuggestion.emit(suggestion);
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
        if (event && event?.code !== Keycodes.SPACE && event?.code !== Keycodes.ENTER) {
            return;
        }

        if (event?.key === Keycodes.ENTER) {
            event.preventDefault();
        }

        this.openDrawer();
    }

    onOverlayKeydown(event: KeyboardEvent): void {
        if (event.key === Keycodes.TAB) {
            if (document.activeElement === this.drawerInput.nativeElement) {
                event.preventDefault();
                this.closeDropdown();
                this.drawerButton.nativeElement.focus();
            }
        }

        if (event.key === Keycodes.ARROW_DOWN) {
            if (document.activeElement === this.drawerInput.nativeElement && this.dropdownOpen) {
                this.suggestionsComp.focusFirstElement();
            }
        }

        if (event.key === Keycodes.ESCAPE) {
            if (this.suggestionsRef?.nativeElement.contains(event.target as HTMLElement)) {
                this.drawerInput.nativeElement.focus();
                this.closeDropdown();
            } else {
                this.drawer.close();
            }
        }
    }
}
