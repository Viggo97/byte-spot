import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil,
} from 'rxjs';

import { OffersService } from '../offers.service';
import { OfferSearchSuggestionsGroup } from './offer-search-suggestions/model/offer-search-suggestion-group.model';

export abstract class OfferSearchBase {
    protected form!: FormControl<string>;
    protected suggestions: OfferSearchSuggestionsGroup[] = [];

    protected destroy$ = new Subject<void>();

    protected abstract searchPhrase: string;
    protected abstract searchPhraseSelected: EventEmitter<string>;

    protected constructor(protected offersService: OffersService) {
    }

    protected initForm(initialValue: string): void {
        this.form = new FormControl<string>(initialValue, { nonNullable: true });
    }

    protected getInputValueChanges(): Observable<OfferSearchSuggestionsGroup[]> {
        return this.form.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.offersService.getSearchSuggestions(searchTerm)),
                takeUntil(this.destroy$),
            );
    }
}
