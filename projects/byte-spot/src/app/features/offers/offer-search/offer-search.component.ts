import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, iif, Observable, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OffersService } from '@app/features/overview/offers.service';
import { OfferSearchSuggestions } from './offer-search-suggestions.interface';
import { OfferSearchDrawerComponent } from './offer-search-drawer/offer-search-drawer.component';
import { OfferSearchDropdownComponent } from './offer-search-dropdown/offer-search-dropdown.component';

@Component({
    selector: 'bsa-offers-search',
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

    @Output() searchOffers = new EventEmitter<string>();

    form = new FormControl<string>('', { nonNullable: true });
    suggestionsSource = new BehaviorSubject<OfferSearchSuggestions[]>([]);
    suggestions$ = this.suggestionsSource.asObservable();

    private destroyRef = inject(DestroyRef);
    private offersService = inject(OffersService);

    ngOnInit(): void {
        this.form.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                switchMap((searchTerm) => iif<OfferSearchSuggestions[], OfferSearchSuggestions[]>(
                    () => searchTerm.length > 0,
                    this.fetchSuggestions(searchTerm),
                    of([]),
                )),
                tap((suggestions) => {
                    this.suggestionsSource.next(suggestions);
                }),
                takeUntilDestroyed(this.destroyRef),
            ).subscribe();
    }

    onSearch(): void {
        this.searchOffers.emit(this.form.getRawValue());
    }

    private fetchSuggestions(searchTerm: string): Observable<OfferSearchSuggestions[]> {
        return this.offersService.getSearchSuggestions(searchTerm);
    }
}
