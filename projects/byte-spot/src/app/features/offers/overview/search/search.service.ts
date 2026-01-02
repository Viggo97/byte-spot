import { DestroyRef, inject, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, iif, map, of, switchMap } from 'rxjs';
import { SearchDataService } from './data/search-data.service';
import { SearchOption } from './models/search-option.interface';
import { CategorySearchOptions } from './models/category-search-options.interface';

@Injectable()
export class SearchService {
    private searchDataService = inject(SearchDataService);
    private destroyRef = inject(DestroyRef);

    searchForm = new FormControl('', {nonNullable: true});
    options$ = this.searchForm.valueChanges
        .pipe(
            debounceTime(200),
            distinctUntilChanged(),
            switchMap((searchTerm) => iif(
                () => searchTerm.length > 0,
                this.searchDataService.getSearchOptions(searchTerm),
                of([] as SearchOption[]),
            )),
            map((options) => this.mapToCategories(options)),
            takeUntilDestroyed(this.destroyRef),
        );

    private mapToCategories(options: SearchOption[]): CategorySearchOptions[] {
        const optionsByCategory: CategorySearchOptions[] = [];
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
}
