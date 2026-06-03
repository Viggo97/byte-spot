import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { form } from '@angular/forms/signals';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, iif, map, of, skip, Subject, switchMap } from 'rxjs';
import { SearchDataService } from './data/search-data.service';
import { SuggestionCategoryGroup } from './models/suggestion-category-group.interface';
import { Suggestion } from './models/suggestion.interface';

@Injectable()
export class SearchService {
    private readonly _route = inject(ActivatedRoute);
    private readonly _destroyRef = inject(DestroyRef);
    private searchDataService = inject(SearchDataService);

    readonly SEARCH_PARAM_KEY = 'search';

    private searchChanged = new Subject<void>();
    searchChanged$ = this.searchChanged.asObservable();

    searchModel = signal({phrase: ''});
    searchForm = form(this.searchModel);

    options$ = toObservable(this.searchForm.phrase().value)
        .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((searchPhrase) => iif(
                () => searchPhrase.length > 0,
                this.searchDataService.getSearchOptions(searchPhrase),
                of([] as Suggestion[]),
            )),
            map((options) => this.mapToCategories(options)),
            takeUntilDestroyed(this._destroyRef),
        );

    constructor() {
        this.subscribeToQueryParamsChanges();
    }

    private mapToCategories(options: Suggestion[]): SuggestionCategoryGroup[] {
        const optionsByCategory: SuggestionCategoryGroup[] = [];
        options.forEach(option => {
            const category = optionsByCategory.find(o => o.category === option.category);
            if (!category) {
                optionsByCategory.push({
                    category: option.category,
                    options: [option],
                });
            } else {
                category.options.push(option);
            }
        });
        return optionsByCategory;
    }

    private subscribeToQueryParamsChanges(): void {
        this._route.queryParamMap
            .pipe(
                skip(1),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe(() => {
                if (!this.isSearchEqualsQueryParams()) {
                    this.setSearch();
                }
            });
    }

    changeSearch(): void {
        this.searchChanged.next();
    }

    getSearchValue(): string {
        return this.searchForm().value().phrase;
    }

    private setSearch(): void {
        const queryParams = this._route.snapshot.queryParams;
        const search = queryParams[this.SEARCH_PARAM_KEY] as string | undefined ?? '';
        this.searchModel.set({phrase: search});
    }

    private isSearchEqualsQueryParams(): boolean {
        const searchValue = this.getSearchValue();
        const queryValue = this._route.snapshot.queryParams;

        return searchValue === queryValue[this.SEARCH_PARAM_KEY];
    }
}
