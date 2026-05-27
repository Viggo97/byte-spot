import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, skip } from 'rxjs';
import { TranslatePipe } from '@core';
import { FiltersService } from '../filters.service';
import { FiltersFormService } from '../form/filters-form.service';
import { FiltersFormComponent } from '../form/filters-form.component';

@Component({
    selector: 'bsa-offers-overview-filters-view-broad',
    imports: [
        TranslatePipe,
        FiltersFormComponent,
    ],
    templateUrl: './filters-view-broad.component.html',
    styleUrl: './filters-view-broad.component.scss',
})
export class FiltersViewBroadComponent implements OnInit {
    private filtersService = inject(FiltersService);
    private filtersFormService = inject(FiltersFormService);
    private destroyRef = inject(DestroyRef);

    private salaryFilterChange = toObservable(this.filtersFormService.salaryFilter)
        .pipe(
            skip(1),
            filter(() => !this.filtersService.preventFormValueChange),
            debounceTime(300),
            takeUntilDestroyed(this.destroyRef),
        );
    private collectionFiltersChange = toObservable(this.filtersFormService.collectionFilters)
        .pipe(
            skip(1),
            filter(() => !this.filtersService.preventFormValueChange),
            takeUntilDestroyed(this.destroyRef),
        );

    ngOnInit(): void {
        this.subscribeToFormChanges();
    }

    protected resetFilters(): void {
        this.filtersService.resetFiltersForm();
    }

    private subscribeToFormChanges(): void {
        this.salaryFilterChange
            .subscribe(() => {
                this.filtersService.changeFilters();
            });
        this.collectionFiltersChange
            .subscribe(() => {
                this.filtersService.changeFilters();
            });
    }
}
