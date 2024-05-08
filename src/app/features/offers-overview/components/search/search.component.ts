import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { AsyncPipe } from '@angular/common';
import {
    Component, ElementRef, OnInit, ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OffersService } from '@app/features/offers-overview/components/offers/offers.service';
import { SuggestionsGroup } from '@app/features/offers-overview/model/suggestions-group.model';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DropdownGroupComponent } from '@app/shared/components/dropdown/dropdown-group/dropdown-group.component';
import { DropdownItemComponent } from '@app/shared/components/dropdown/dropdown-item/dropdown-item.component';
import {
    DropdownSeparatorComponent,
} from '@app/shared/components/dropdown/dropdown-separator/dropdown-separator.component';
import {
    debounceTime, distinctUntilChanged, Observable, switchMap,
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
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
    suggestionsOpen = false;
    form = new FormControl<string>('');
    suggestions$!: Observable<SuggestionsGroup[]>;

    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild(DropdownComponent) dropdown!: DropdownComponent;

    constructor(private offersService: OffersService) {
    }

    ngOnInit(): void {
        this.suggestions$ = this.form.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.offersService.getSearchSuggestions(searchTerm)),
            );
    }

    onOutsideClick($event: MouseEvent): void {
        if ($event.target === this.searchInput.nativeElement) {
            return;
        }
        this.suggestionsOpen = false;
    }

    onInputKeydown(event: KeyboardEvent): void {
        if (event.key === 'ArrowDown' && this.suggestionsOpen) {
            event.preventDefault();
            this.dropdown.focusFirstElement();
        }
    }

    onOverlayKeydown(event: KeyboardEvent): void {
        if (event.key === 'Tab') {
            if (document.activeElement === this.searchInput.nativeElement) {
                this.suggestionsOpen = false;
            } else {
                this.searchInput.nativeElement.focus();
            }
        }
    }

    onDetach(): void {
        this.suggestionsOpen = false;
        this.searchInput.nativeElement.focus();
    }
}
