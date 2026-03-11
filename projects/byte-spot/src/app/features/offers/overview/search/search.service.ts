import { DestroyRef, inject, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, iif, map, of, Subject, switchMap } from 'rxjs';
import { SearchDataService } from './data/search-data.service';
import { SuggestionCategoryGroup } from './models/suggestion-category-group.interface';
import { Suggestion } from './models/suggestion.interface';

@Injectable()
export class SearchService {
    private searchDataService = inject(SearchDataService);
    private destroyRef = inject(DestroyRef);

    private searchChanged = new Subject<void>();
    searchChanged$ = this.searchChanged.asObservable();

    searchForm = new FormControl('', {nonNullable: true});
    options$ = this.searchForm.valueChanges
        .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((searchPhrase) => iif(
                () => searchPhrase.length > 0,
                this.searchDataService.getSearchOptions(searchPhrase),
                of([] as Suggestion[]),
            )),
            map((options) => this.mapToCategories(options)),
            takeUntilDestroyed(this.destroyRef),
        );

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

    changeSearch(): void {
        this.searchChanged.next();
    }

    getSearchValue(): string {
        return this.searchForm.getRawValue();
    }
}
