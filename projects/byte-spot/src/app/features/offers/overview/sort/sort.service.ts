import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip, Subject } from 'rxjs';
import { TranslateService } from '@core';
import { SortBy } from './sort-by.enum';
import { SortByOption } from './models/sort-by-option.interface';

@Injectable()
export class SortService {
    private readonly _route = inject(ActivatedRoute);
    private readonly _destroyRef = inject(DestroyRef);
    private translateService = inject(TranslateService);

    readonly SORT_PARAM_KEY = 'sort';

    private sortChanged = new Subject<void>();
    sortChanged$ = this.sortChanged.asObservable();

    options = signal<SortByOption[]>(
        [
            {
                key: SortBy.LATEST,
                label: this.translateService.translate('offer.latest'),
            },
            {
                key: SortBy.HIGHEST_SALARY,
                label: this.translateService.translate('offer.highestSalary'),
            },
            {
                key: SortBy.LOWEST_SALARY,
                label: this.translateService.translate('offer.lowestSalary'),
            },
        ],
    );

    sortBy = signal(this.options()[0]);

    constructor() {
        this.subscribeToQueryParamsChanges();
    }

    changeSort(): void {
        this.sortChanged.next();
    }

    getSortValue(): string {
        return this.sortBy().key;
    }

    private subscribeToQueryParamsChanges(): void {
        this._route.queryParamMap
            .pipe(
                skip(1),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe(() => {
                if (!this.isSortEqualsQueryParams()) {
                    this.setSort();
                }
            });
    }

    private setSort(): void {
        const queryParams = this._route.snapshot.queryParams;
        const querySort = queryParams[this.SORT_PARAM_KEY] as SortBy | undefined;
        const sort = this.options().find(o => o.key === querySort) ?? this.options()[0];
        this.sortBy.set(sort);
    }

    private isSortEqualsQueryParams(): boolean {
        const sortValue = this.getSortValue();
        const queryValue = this._route.snapshot.queryParams;

        return sortValue === queryValue[this.SORT_PARAM_KEY];
    }
}
