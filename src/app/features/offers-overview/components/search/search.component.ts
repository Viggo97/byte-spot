import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
    Component, ElementRef, OnInit, ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/features/offers-overview/components/input/input.component';
import { OffersService } from '@app/features/offers-overview/components/offers/offers.service';
import { SuggestionsComponent } from '@app/features/offers-overview/components/suggestions/suggestions.component';
import { SuggestionsGroup } from '@app/features/offers-overview/model/suggestions-group.model';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DropdownGroupComponent } from '@app/shared/components/dropdown/dropdown-group/dropdown-group.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { DropdownItemComponent } from '@app/shared/components/dropdown/dropdown-item/dropdown-item.component';
import {
    DropdownSeparatorComponent,
} from '@app/shared/components/dropdown/dropdown-separator/dropdown-separator.component';
import { Keycodes } from '@app/shared/enums/keycodes/keycodes.enum';
import {
    debounceTime, distinctUntilChanged, switchMap,
} from 'rxjs';

@Component({
    selector: 'bsa-search',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        AsyncPipe,
        DropdownComponent,
        DropdownGroupComponent,
        DropdownItemComponent,
        DropdownSeparatorComponent,
        CdkConnectedOverlay,
        CdkOverlayOrigin,
        SuggestionsComponent,
        NgTemplateOutlet,
        InputComponent,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
    suggestionsOpen = false;
    form = new FormControl<string>('');
    suggestions: SuggestionsGroup[] = [];

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(DropdownComponent) dropdown!: DropdownComponent;

    constructor(private offersService: OffersService) {
    }

    ngOnInit(): void {
        this.form.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.offersService.getSearchSuggestions(searchTerm)),
            )
            .subscribe((value) => {
                this.suggestionsOpen = true;
                this.suggestions = value;
            });
    }

    onOutsideClick($event: MouseEvent): void {
        if ($event.target === this.searchInput.nativeElement) {
            return;
        }
        this.suggestionsOpen = false;
    }

    onOverlayKeydown(event: KeyboardEvent): void {
        // console.log(this.maxDropdownHeight);

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

    onSelectItem(item: DropdownItem): void {
        this.suggestionsOpen = false;
    }

    get maxDropdownHeight(): string {
        return `${window.innerHeight - this.searchInput.nativeElement.getBoundingClientRect().bottom - 10}px`;
    }
}
