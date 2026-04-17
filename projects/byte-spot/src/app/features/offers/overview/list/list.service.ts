import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, merge, Subject, switchMap, tap } from 'rxjs';
import { PagedResults } from '@shared';
import { ListDataService } from './data/list.data.service';
import { FiltersService } from '../filters/filters.service';
import { SortService } from '../sort/sort.service';
import { SearchService } from '../search/search.service';
import { InfoService } from '../info/info.service';
import { PaginationService } from './pagination.service';
import { OffersListParams } from './models/offers-list-params.interface';
import { Offer } from './models/offer.interface';

@Injectable()
export class ListService {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _listDataService = inject(ListDataService);
    private readonly _filtersService = inject(FiltersService);
    private readonly _sortService = inject(SortService);
    private readonly _searchService = inject(SearchService);
    private readonly _paginationService = inject(PaginationService);
    private readonly _infoService = inject(InfoService);

    private fetchingOffers = new BehaviorSubject(true);
    fetchingOffers$ = this.fetchingOffers.asObservable();

    private offersInitialized = new Subject<void>();
    offersInitialized$ = this.offersInitialized.asObservable();

    private offers = new BehaviorSubject<PagedResults<Offer> | null>(null);
    offers$ = this.offers.asObservable();

    constructor() {
        this.fetchData();
    }

    private fetchData(): void {
        this._listDataService.getOffersList()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(offers => {
                this._infoService.total.set(offers.totalCount);
                this.fetchingOffers.next(false);
                this.offers.next(offers);

                this.listenForCriteriaChange();

                this.offersInitialized.next();
                this.offersInitialized.complete();
            });
    }

    private listenForCriteriaChange(): void {
        merge(
            this._filtersService.filtersChanged$,
            this._sortService.sortChanged$,
            this._searchService.searchChanged$,
            this._paginationService.paginationChanged$,
        ).pipe(
            tap(() => { this.fetchingOffers.next(true); }),
            switchMap(() => this._listDataService.getOffersList(this.getValuesForParams())),
            tap((offers) => { this._infoService.total.set(offers.totalCount); }),
            tap((offers) => { this.offers.next(offers); }),
            tap(() => { this.fetchingOffers.next(false); }),
            takeUntilDestroyed(this._destroyRef),
        ).subscribe();
    }

    private getValuesForParams(): OffersListParams {
        return {
            sortBy: this._sortService.getSortValue(),
            searchPhrase: this._searchService.getSearchValue(),
            ...this._paginationService.getPaginationParams(),
            ...this._filtersService.getFilterParams(),
        };
    }
}
