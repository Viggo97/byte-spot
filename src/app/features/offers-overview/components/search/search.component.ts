import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
    Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/features/offers-overview/components/input/input.component';
import { OffersService } from '@app/features/offers-overview/components/offers/offers.service';
import { SuggestionsComponent } from '@app/features/offers-overview/components/suggestions/suggestions.component';
import { SearchBase } from '@app/features/offers-overview/model/search-base';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { Keycodes } from '@app/shared/enums/keycodes/keycodes.enum';

@Component({
    selector: 'bsa-search',
    standalone: true,
    imports: [
        CdkConnectedOverlay,
        CdkOverlayOrigin,
        DropdownComponent,
        InputComponent,
        ReactiveFormsModule,
        SuggestionsComponent,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent extends SearchBase implements OnInit, OnDestroy {
    @Input({ required: true }) searchValue!: string;

    @Output() searchValueChanged = new EventEmitter<string>();

    @ViewChild(InputComponent) searchInput!: InputComponent;
    @ViewChild(DropdownComponent) dropdown!: DropdownComponent;

    suggestionsOpen = false;

    constructor(offersService: OffersService) {
        super(offersService);
    }

    ngOnInit(): void {
        this.initForm(this.searchValue);
        this.getInputValueChanges().subscribe((suggestions) => {
            this.suggestionsOpen = true;
            this.suggestions = suggestions;
        });
    }

    onSuggestionSelected(item: DropdownItem): void {
        this.searchValueChanged.emit(item.value);
        this.suggestionsOpen = false;
    }

    protected onOutsideClick($event: MouseEvent): void {
        if ($event.target === this.searchInput.input.nativeElement) {
            return;
        }
        this.suggestionsOpen = false;
    }

    protected onOverlayKeydown(event: KeyboardEvent): void {
        if (event.key === Keycodes.TAB) {
            if (document.activeElement !== this.searchInput.input.nativeElement) {
                this.searchInput.input.nativeElement.focus();
            }
            this.suggestionsOpen = false;
        }

        if (event.key === Keycodes.ARROW_DOWN) {
            event.preventDefault();
            if (document.activeElement === this.searchInput.input.nativeElement && this.suggestionsOpen) {
                this.dropdown.focusFirstElement();
            }
        }

        if (event.key === Keycodes.ESCAPE) {
            if (document.activeElement !== this.searchInput.input.nativeElement) {
                this.searchInput.input.nativeElement.focus();
            }
        }
    }

    get maxDropdownHeight(): string {
        return `${window.innerHeight - this.searchInput.input.nativeElement.getBoundingClientRect().bottom - 16}px`;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
