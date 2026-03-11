import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, merge, startWith, switchMap, tap } from 'rxjs';
import { HttpParamsConverter } from '@shared';
import { ListDataService } from './data/list.data.service';
import { FiltersService } from '../filters/filters.service';
import { SortService } from '../sort/sort.service';
import { SearchService } from '../search/search.service';
import { InfoService } from '../info/info.service';
import { PaginationService } from './pagination.service';

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

    offers$ = merge(
        this.filtersService.filtersChanged$,
        this.sortService.sortChanged$,
        this.searchService.searchChanged$,
        this.paginationService.paginationChanged$,
    ).pipe(
        startWith(null),
        tap(() => { this.fetchingOffers.next(true); }),
        switchMap(() => this.listDataService.getOffers(this.createHttpParams())),
        tap((offers) => { this.infoService.total.set(offers.totalCount); }),
        tap(() => { this.fetchingOffers.next(false); }),
        takeUntilDestroyed(this.destroyRef),
    );

    private createHttpParams(): HttpParams {
        return HttpParamsConverter({
            sortBy: this.sortService.getSortValue(),
            searchPhrase: this.searchService.getSearchValue(),
            ...this.paginationService.getPaginationParams(),
            ...this.filtersService.getFilterParams(),
        });
    }
}
