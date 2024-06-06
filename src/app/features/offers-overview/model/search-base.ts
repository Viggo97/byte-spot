import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OffersService } from '@app/features/offers-overview/components/offers/offers.service';
import { SuggestionsGroup } from '@app/features/offers-overview/model/suggestions-group.model';
import {
    debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil,
} from 'rxjs';

export abstract class SearchBase {
    protected form!: FormControl<string>;
    protected suggestions: SuggestionsGroup[] = [];

    protected destroy$ = new Subject<void>();

    protected abstract searchPhrase: string;
    protected abstract searchPhraseSelected: EventEmitter<string>;

    protected constructor(protected offersService: OffersService) {
    }

    protected initForm(initialValue: string): void {
        this.form = new FormControl<string>(initialValue, { nonNullable: true });
    }

    protected getInputValueChanges(): Observable<SuggestionsGroup[]> {
        return this.form.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.offersService.getSearchSuggestions(searchTerm)),
                takeUntil(this.destroy$),
            );
    }
}
