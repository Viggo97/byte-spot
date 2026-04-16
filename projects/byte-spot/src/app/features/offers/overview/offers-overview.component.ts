import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

import { LoaderComponent } from '@shared';
import { TranslatePipe } from '@core';
import { FiltersService } from './filters/filters.service';
import { FiltersFormService } from './filters/form/filters-form.service';
import { FiltersViewBroadComponent } from './filters/view-broad/filters-view-broad.component';
import { FiltersViewCompactComponent } from './filters/view-compact/filters-view-compact.component';
import { SortComponent } from './sort/sort.component';
import { InfoComponent } from './info/info.component';
import { SearchService } from './search/search.service';
import { SearchDataService } from './search/data/search-data.service';
import { SearchViewBroadComponent } from './search/view-broad/search-view-broad.component';
import { SearchViewCompactComponent } from './search/view-compact/search-view-compact.component';
import { SortService } from './sort/sort.service';
import { ListDataService } from './list/data/list.data.service';
import { ListService } from './list/list.service';
import { OfferListComponent } from './list/offer-list.component';
import { PaginationService } from './list/pagination.service';
import { InfoService } from './info/info.service';
import { OffersOverviewService } from './offers-overview.service';

@Component({
    selector: 'bsa-offers-overview',
    imports: [
        TranslatePipe,
        FiltersViewBroadComponent,
        FiltersViewCompactComponent,
        SortComponent,
        InfoComponent,
        SearchViewBroadComponent,
        SearchViewCompactComponent,
        OfferListComponent,
        LoaderComponent,
    ],
    templateUrl: './offers-overview.component.html',
    styleUrl: './offers-overview.component.scss',
    providers: [
        FiltersFormService,
        FiltersService,
        SearchDataService,
        SearchService,
        SortService,
        ListDataService,
        ListService,
        PaginationService,
        InfoService,
    ],
})
export class OffersOverviewComponent {
    private readonly _breakpointObserver = inject(BreakpointObserver);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _offersOverviewService = inject(OffersOverviewService);
    private readonly _filtersService = inject(FiltersService);
    private readonly _listService = inject(ListService);

    compactMode = signal(window.innerWidth < 960);
    loading = signal(this._offersOverviewService.initialLoad);

    constructor() {
        this.subscribeToBreakpointObserver();
        this.subscribeToInitialDataLoad();
    }

    private subscribeToBreakpointObserver(): void {
        this._breakpointObserver.observe('(min-width: 960px)')
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((state) => {
                this.compactMode.set(!state.matches);
            });
    }

    private subscribeToInitialDataLoad(): void {
        forkJoin([
            this._filtersService.filtersInitialized$,
            this._listService.offersInitialized$,
        ])
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this._offersOverviewService.initialLoad = false;
                this.loading.set(false);
            });
    }
}
