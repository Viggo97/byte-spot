import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, merge, Observable, of, switchMap, tap } from 'rxjs';
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
    private destroyRef = inject(DestroyRef);
    private listDataService = inject(ListDataService);
    private filtersService = inject(FiltersService);
    private sortService = inject(SortService);
    private searchService = inject(SearchService);
    private infoService = inject(InfoService);
    private paginationService = inject(PaginationService);

    private fetchingOffers = new BehaviorSubject(false);
    fetchingOffers$ = this.fetchingOffers.asObservable();

    offers$!: Observable<PagedResults<Offer>>;
    private initialOffers$!: Observable<PagedResults<Offer>>;
    private filteredOffers$ = merge(
        this.filtersService.filtersChanged$,
        this.sortService.sortChanged$,
        this.searchService.searchChanged$,
        this.paginationService.paginationChanged$,
    ).pipe(
        tap(() => { this.fetchingOffers.next(true); }),
        switchMap(() => this.listDataService.getOffersList(this.getValuesForParams())),
        tap((offers) => { this.infoService.total.set(offers.totalCount); }),
        tap(() => { this.fetchingOffers.next(false); }),
        takeUntilDestroyed(this.destroyRef),
    );

    initList(offers: PagedResults<Offer>): void {
        this.initialOffers$ = of(offers);
        this.offers$ = merge(this.initialOffers$, this.filteredOffers$);
    }

    private getValuesForParams(): OffersListParams {
        return {
            sortBy: this.sortService.getSortValue(),
            searchPhrase: this.searchService.getSearchValue(),
            ...this.paginationService.getPaginationParams(),
            ...this.filtersService.getFilterParams(),
        };
    }
}
