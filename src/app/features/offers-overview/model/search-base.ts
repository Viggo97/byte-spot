import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OffersService } from '@app/features/offers-overview/components/offers/offers.service';
import { SuggestionsGroup } from '@app/features/offers-overview/model/suggestions-group.model';
import {
    debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil,
} from 'rxjs';

export abstract class SearchBase {
    protected form = new FormControl<string>('');
    protected suggestions: SuggestionsGroup[] = [];

    protected destroy$ = new Subject<void>();

    abstract closeDrawer: EventEmitter<void>;

    protected constructor(protected offersService: OffersService) {
    }

    protected getInputValueChanges(): Observable<any> {
        return this.form.valueChanges
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.offersService.getSearchSuggestions(searchTerm)),
                takeUntil(this.destroy$),
            );
    }
}
