import { DestroyRef, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    debounceTime, distinctUntilChanged, Observable, switchMap,
} from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OffersService } from '../offers.service';
import { OfferSearchSuggestionsGroup } from './offer-search-suggestions/model/offer-search-suggestion-group.model';

export abstract class OfferSearchBase {
    protected form!: FormControl<string>;
    protected suggestions: OfferSearchSuggestionsGroup[] = [];

    protected abstract searchPhrase: string;
    protected abstract searchPhraseSelected: EventEmitter<string>;

    protected constructor(
        private destroyRef: DestroyRef,
        protected offersService: OffersService,
    ) {}

    protected initForm(initialValue: string): void {
        this.form = new FormControl<string>(initialValue, { nonNullable: true });
    }

    protected getInputValueChanges(): Observable<OfferSearchSuggestionsGroup[]> {
        return this.form.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.offersService.getSearchSuggestions(searchTerm)),
                takeUntilDestroyed(this.destroyRef),
            );
    }
}
