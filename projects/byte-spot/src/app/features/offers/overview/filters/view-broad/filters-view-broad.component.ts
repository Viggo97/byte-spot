import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkeletonComponent } from '@byte-spot-lib';
import { TranslatePipe } from '@core';
import { FiltersService } from '../filters.service';
import { FiltersFormComponent } from '../form/filters-form.component';

@Component({
    selector: 'bsa-offers-overview-filters-view-broad',
    imports: [
        TranslatePipe,
        FiltersFormComponent,
        SkeletonComponent,
    ],
    templateUrl: './filters-view-broad.component.html',
    styleUrl: './filters-view-broad.component.scss',
})
export class FiltersViewBroadComponent {
    private filtersService = inject(FiltersService);

    protected filtersInitialized = toSignal(this.filtersService.filtersInitialized$, {initialValue: false});

    protected resetFilters(): void {
        this.filtersService.resetFiltersForm();
    }
}
