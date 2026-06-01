import { computed, Injectable, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter, Subject } from 'rxjs';
import { LookupItem } from '@shared';
import { Salary } from '../models/salary.model';
import { DynamicFilters } from '../models/dynamic-filters.model';

@Injectable()
export class FiltersFormService {
    salaryFilterModel = signal(Salary.default());
    dynamicFiltersModel = signal(DynamicFilters.default());

    salaryFilterForm = form(this.salaryFilterModel);
    dynamicFiltersForm = form(this.dynamicFiltersModel);

    salaryFilterChange = computed(() => this.salaryFilterModel());
    salaryFilterChange$ = toObservable(this.salaryFilterChange);
    dynamicFiltersChange = computed(() => this.dynamicFiltersModel());
    dynamicFiltersChange$ = toObservable(this.dynamicFiltersChange);

    private trackValueChange = false;
    private filtersChanged = new Subject<void>();
    filtersChanged$ = this.filtersChanged.asObservable();

    constructor() {
        this.salaryFilterChange$
            .pipe(
                filter(() => this.trackValueChange),
                debounceTime(300),
                takeUntilDestroyed(),
            )
            .subscribe(() => {
                this.changeFilters();
            });
        this.dynamicFiltersChange$
            .pipe(
                filter(() => this.trackValueChange),
                takeUntilDestroyed(),
            )
            .subscribe(() => {
                this.changeFilters();
            });
    }

    fillDynamicFiltersForm(items: LookupItem[], filterName: keyof DynamicFilters): void {
        const cleanArray = new Array<boolean>(items.length).fill(false);
        this.dynamicFiltersForm[filterName]().value.set(cleanArray);
    }

    startTrackingValueChange(): void {
        setTimeout(() => {
            this.trackValueChange = true;
        });
    }

    stopTrackingValueChange(): void {
        this.trackValueChange = false;
    }

    changeFilters(): void {
        this.filtersChanged.next();
    }
}
