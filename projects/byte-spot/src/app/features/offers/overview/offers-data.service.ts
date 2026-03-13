import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, of, Subject, take } from 'rxjs';
import { PagedResults } from '@shared';
import { Offer } from './list/models/offer.interface';
import { FiltersDataService } from './filters/data/filters-data.service';
import { FiltersService } from './filters/filters.service';
import { ListDataService } from './list/data/list.data.service';
import { ListService } from './list/list.service';

@Injectable()
export class OffersDataService {
    private readonly _filtersDataService = inject(FiltersDataService);
    private readonly _filtersService = inject(FiltersService);
    private readonly _listDataService = inject(ListDataService);
    private readonly _listService = inject(ListService);

    private readonly dataFetched = new Subject<boolean>();
    dataFetched$ = this.dataFetched.asObservable().pipe(take(1));

    fetchData(): void {
        forkJoin([
            this._filtersDataService.getTechnologies().pipe(catchError(() => of([]))),
            this._filtersDataService.getLocations().pipe(catchError(() => of([]))),
            this._filtersDataService.getWorkModes().pipe(catchError(() => of([]))),
            this._filtersDataService.getExperienceLevels().pipe(catchError(() => of([]))),
            this._filtersDataService.getEmploymentTypes().pipe(catchError(() => of([]))),
            this._listDataService.getOffersList().pipe(catchError(() => of<PagedResults<Offer>>({
                items: [],
                pageSize: 10,
                pageNumber: 1,
                totalCount: 0,
            }))),
        ]).subscribe(([technologies, locations, workModes, experienceLevels, employmentTypes, offers]) => {
            this._filtersService.initFilters(technologies, locations, workModes, experienceLevels, employmentTypes);
            this._listService.initList(offers);
            this.dataFetched.next(true);
            this.dataFetched.complete();
        });
    }
}
