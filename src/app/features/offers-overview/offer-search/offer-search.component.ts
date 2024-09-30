import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, skip, startWith, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OffersService } from '@app/features/offers-overview/offers.service';
import { OfferSearchDrawerComponent } from './offer-search-drawer/offer-search-drawer.component';
import { OfferSearchDropdownComponent } from './offer-search-dropdown/offer-search-dropdown.component';
import { OfferSearchSuggestionsGroup } from './offer-search-suggestions/model/offer-search-suggestion-group.model';

@Component({
    selector: 'bsa-offer-search',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        OfferSearchDrawerComponent,
        OfferSearchDropdownComponent,
    ],
    templateUrl: './offer-search.component.html',
    styleUrl: './offer-search.component.scss',
})
export class OfferSearchComponent implements OnInit {
    @Input({ required: true }) compactMode!: boolean;

    form = new FormControl<string>('', { nonNullable: true });
    suggestions: OfferSearchSuggestionsGroup[] = [];
    suggestionsLoaded$ = new Subject<void>();

    constructor(
        private destroyRef: DestroyRef,
        protected offersService: OffersService,
    ) {}

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
                    this.suggestionsLoaded$.next();
                }),
                takeUntilDestroyed(this.destroyRef),
            ).subscribe();
    }

    private fetchSuggestions(searchTerm: string): Observable<OfferSearchSuggestionsGroup[]> {
        return this.offersService.getSearchSuggestions(searchTerm);
    }

    onSelectSuggestion(searchTerm: string): void {
        this.form.setValue(searchTerm, { emitEvent: false });
        this.fetchSuggestions(searchTerm)
            .subscribe((suggestions) => {
                this.suggestions = suggestions;
            });
    }
}
