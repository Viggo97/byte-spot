import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { PagedResults } from '@shared';
import { ListDataService } from './data/list.data.service';
import { FiltersService } from '../filters/filters.service';
import { SortService } from '../sort/sort.service';
import { SearchService } from '../search/search.service';
import { InfoService } from '../info/info.service';
import { PaginationService } from './pagination.service';
import { OffersListParams } from './models/offers-list-params.interface';
import { Offer } from './models/offer.interface';
import { OfferListQueryService } from 'projects/byte-spot/src/app/features/offers/overview/list/offer-list-query.service';

@Injectable()
export class ListService {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _listDataService = inject(ListDataService);
    private readonly _filtersService = inject(FiltersService);
    private readonly _sortService = inject(SortService);
    private readonly _searchService = inject(SearchService);
    private readonly _paginationService = inject(PaginationService);
    private readonly _infoService = inject(InfoService);
    private readonly _queryParamsService = inject(OfferListQueryService);

    private fetchingOffers = new BehaviorSubject(true);
    fetchingOffers$ = this.fetchingOffers.asObservable();

    private offers = new BehaviorSubject<PagedResults<Offer> | null>(null);
    offers$ = this.offers.asObservable();

    constructor() {
        this.fetchData();
    }

    private fetchData(): void {
        this._listDataService.getOffersList(this.getValuesForParams())
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(offers => {
                this._infoService.total.set(offers.totalCount);
                this.fetchingOffers.next(false);
                this.offers.next(offers);

                this.listenForCriteriaChange();
            });
    }

    private listenForCriteriaChange(): void {
        this._queryParamsService.paramsChanged$.pipe(
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
