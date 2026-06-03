import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, from, map, skip, Subject, switchMap, tap } from 'rxjs';
import { FiltersService } from '../filters/filters.service';
import { PaginationService } from '../list/pagination.service';
import { SortService } from '../sort/sort.service';
import { SearchService } from '../search/search.service';

@Injectable()
export class OfferListQueryService {
    private readonly _route = inject(ActivatedRoute);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    private readonly _filtersService = inject(FiltersService);
    private readonly _sortService = inject(SortService);
    private readonly _searchService = inject(SearchService);
    private readonly _paginationService = inject(PaginationService);

    private paramsChanged = new Subject<void>();
    paramsChanged$ = this.paramsChanged.asObservable();

    concurrentUpdates = false;

    constructor() {
        this.listenForQueryParamsChange();
        this.listenForFiltersChange();
        this.listenForSortChange();
        this.listenForSearchChange();
        this.listenForPaginationChange();
    }

    private listenForQueryParamsChange(): void {
        this._route.queryParamMap
            .pipe(
                skip(1),
                filter(() => !this.concurrentUpdates),
                tap(() => {
                    this.paramsChanged.next(); }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe();
    }

    private listenForFiltersChange(): void {
        this._filtersService.filtersChanged$
            .pipe(
                filter(() => !this.concurrentUpdates),
                tap(() => { this.concurrentUpdates = true; }),
                map(() => {
                    const filtersQueryParams = this._filtersService.getFilterParamsFromForm();
                    return {
                        [this._paginationService.PAGE_PARAM_KEY]: 1,
                        ...filtersQueryParams,
                    };
                }),
                switchMap((queryParams) => from(
                    this._router.navigate([], {queryParams, queryParamsHandling: 'merge'})),
                ),
                tap(() => {
                    this.concurrentUpdates = false;
                    this.paramsChanged.next();
                }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe();
    }

    private listenForSortChange(): void {
        this._sortService.sortChanged$
            .pipe(
                filter(() => !this.concurrentUpdates),
                tap(() => { this.concurrentUpdates = true; }),
                map(() => {
                    return {[this._sortService.SORT_PARAM_KEY]: this._sortService.getSortValue()};
                }),
                switchMap((queryParams) => from(
                    this._router.navigate([], {queryParams, queryParamsHandling: 'merge'})),
                ),
                tap(() => {
                    this.concurrentUpdates = false;
                    this.paramsChanged.next();
                }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe();
    }

    private listenForSearchChange(): void {
        this._searchService.searchChanged$
            .pipe(
                filter(() => !this.concurrentUpdates),
                tap(() => { this.concurrentUpdates = true; }),
                map(() => {
                    return {[this._searchService.SEARCH_PARAM_KEY]: this._searchService.getSearchValue()};
                }),
                switchMap((queryParams) => from(
                    this._router.navigate([], {queryParams, queryParamsHandling: 'merge'})),
                ),
                tap(() => {
                    this.concurrentUpdates = false;
                    this.paramsChanged.next();
                }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe();
    }

    private listenForPaginationChange(): void {
        this._paginationService.paginationChanged$
            .pipe(
                filter(() => !this.concurrentUpdates),
                tap(() => { this.concurrentUpdates = true; }),
                map(() => {
                    return {[this._paginationService.PAGE_PARAM_KEY]: this._paginationService.page()};
                }),
                switchMap((queryParams) => from(
                    this._router.navigate([], {queryParams, queryParamsHandling: 'merge'})),
                ),
                tap(() => {
                    this.concurrentUpdates = false;
                    this.paramsChanged.next();
                }),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe();
    }
}
