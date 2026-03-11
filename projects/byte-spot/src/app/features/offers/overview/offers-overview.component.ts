import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';

import { FiltersService } from './filters/filters.service';
import { FiltersFormService } from './filters/form/filters-form.service';
import { FiltersDataService } from './filters/data/filters-data.service';
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

@Component({
    selector: 'bsa-offers-overview',
    imports: [
        FiltersViewBroadComponent,
        FiltersViewCompactComponent,
        SortComponent,
        InfoComponent,
        SearchViewBroadComponent,
        SearchViewCompactComponent,
        OfferListComponent,
    ],
    templateUrl: './offers-overview.component.html',
    styleUrl: './offers-overview.component.scss',
    providers: [
        FiltersFormService,
        FiltersDataService,
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
    private breakpointObserver = inject(BreakpointObserver);
    private destroyRef = inject(DestroyRef);

    compactMode = signal(window.innerWidth < 960);

    constructor() {
        this.subscribeToBreakpointObserver();
    }

    private subscribeToBreakpointObserver(): void {
        this.breakpointObserver.observe('(min-width: 960px)')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((state) => {
                this.compactMode.set(!state.matches);
            });
    }
}
