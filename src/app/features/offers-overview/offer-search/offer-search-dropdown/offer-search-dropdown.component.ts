import {
    Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { Keycodes } from '@app/shared/enums/keycodes/keycodes.enum';

import { OfferSearchBase } from '../offer-search-base';
import { OffersService } from '../../offers.service';
import { OfferSearchSuggestionsComponent } from '../offer-search-suggestions/offer-search-suggestions.component';

@Component({
    selector: 'bsa-offer-search-dropdown',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        DropdownComponent,
        OfferSearchSuggestionsComponent,
    ],
    templateUrl: './offer-search-dropdown.component.html',
    styleUrl: './offer-search-dropdown.component.scss',
})
export class OfferSearchDropdownComponent extends OfferSearchBase implements OnInit, OnDestroy {
    @Input({ required: true }) searchPhrase!: string;

    @Output() searchPhraseSelected = new EventEmitter<string>();

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(DropdownComponent) dropdown!: DropdownComponent;

    suggestionsOpen = false;

    constructor(offersService: OffersService) {
        super(offersService);
    }

    ngOnInit(): void {
        this.initForm(this.searchPhrase);
        this.getInputValueChanges().subscribe((suggestions) => {
            this.suggestionsOpen = true;
            this.suggestions = suggestions;
        });
    }

    onSuggestionSelected(item: DropdownItem<string>): void {
        this.suggestions = [];
        this.form.setValue(item.value, { emitEvent: false });
        this.searchPhraseSelected.emit(item.value);
        this.suggestionsOpen = false;
    }

    onOutsideClick($event: MouseEvent): void {
        if ($event.target === this.searchInput.nativeElement) {
            return;
        }
        this.suggestionsOpen = false;
    }

    onOverlayKeydown(event: KeyboardEvent): void {
        if (event.key === Keycodes.TAB) {
            if (document.activeElement !== this.searchInput.nativeElement) {
                this.searchInput.nativeElement.focus();
            }
            this.suggestionsOpen = false;
        }

        if (event.key === Keycodes.ARROW_DOWN) {
            event.preventDefault();
            if (document.activeElement === this.searchInput.nativeElement && this.suggestionsOpen) {
                this.dropdown.focusFirstElement();
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
