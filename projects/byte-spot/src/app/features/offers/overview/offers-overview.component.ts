import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';

import { FiltersService } from './filters/filters.service';
import { FiltersFormService } from './filters/form/filters-form.service';
import { FiltersDataService } from './filters/data/filters-data.service';
import { FiltersViewBroadComponent } from './filters/view-broad/filters-view-broad.component';
import { FiltersViewCompactComponent } from './filters/view-compact/filters-view-compact.component';

@Component({
    selector: 'bsa-offers-overview',
    imports: [
        FiltersViewBroadComponent,
        FiltersViewCompactComponent,
    ],
    templateUrl: './offers-overview.component.html',
    styleUrl: './offers-overview.component.scss',
    providers: [
        FiltersFormService,
        FiltersDataService,
        FiltersService,
    ],
})
export class OffersOverviewComponent {
    private breakpointObserver = inject(BreakpointObserver);
    private filtersService = inject(FiltersService);
    private destroyRef = inject(DestroyRef);

    compactMode = signal(window.innerWidth < 960);

    constructor() {
        this.subscribeToBreakpointObserver();
        this.subscribeToFiltersChange();
    }

    private subscribeToBreakpointObserver(): void {
        this.breakpointObserver.observe('(min-width: 960px)')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((state) => {
                this.compactMode.set(!state.matches);
            });
    }

    private subscribeToFiltersChange(): void {
        this.filtersService.filtersChanged$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                const filters = this.filtersService.createFilterParams();
                // TODO fetch offers
            });
    }
}
