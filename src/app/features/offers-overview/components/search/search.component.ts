import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OffersService } from '@app/features/offers-overview/components/offers/offers.service';
import { SuggestionsGroup } from '@app/features/offers-overview/model/suggestions-group.model';
import {
    debounceTime, distinctUntilChanged, Observable, switchMap,
} from 'rxjs';

@Component({
    selector: 'bsa-search',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        AsyncPipe,
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
    suggestionsVisible = false;
    form = new FormControl<string>('');
    suggestions$!: Observable<SuggestionsGroup[]>;

    constructor(private offersService: OffersService) {
    }

    ngOnInit(): void {
        this.suggestions$ = this.form.valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap((searchTerm) => this.offersService.getSearchSuggestions(searchTerm)),
            );
    }

    onFocus(): void {
        this.suggestionsVisible = true;
    }

    onBlur(): void {
        this.suggestionsVisible = false;
    }
}
