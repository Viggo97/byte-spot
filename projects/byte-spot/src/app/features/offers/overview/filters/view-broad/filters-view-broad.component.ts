import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, merge } from 'rxjs';
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

    ngOnInit(): void {
        this.subscribeToFormChanges();
    }

    protected resetFilters(): void {
        this.filtersFormService.form.reset(undefined, {emitEvent: false});
    }

    private subscribeToFormChanges(): void {
        this.filtersFormService.form.controls.salary.valueChanges
            .pipe(
                debounceTime(300),
                takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.filtersService.changeFilters();
            });
        merge(
            this.filtersFormService.form.controls.workMode.valueChanges,
            this.filtersFormService.form.controls.employmentType.valueChanges,
            this.filtersFormService.form.controls.seniority.valueChanges,
            this.filtersFormService.form.controls.technologies.valueChanges,
            this.filtersFormService.form.controls.locations.valueChanges,
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.filtersService.changeFilters();
            });
    }
}
