import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, forkJoin, of } from 'rxjs';
import { LookupItem } from '@shared';
import { Salary } from './models/salary.model';
import { DynamicFilters } from './models/dynamic-filters.model';
import { Technology } from './models/technology.interface';
import { FilterParams } from './models/filter-params.interface';
import { FiltersFormService } from './form/filters-form.service';
import { FiltersDataService } from './data/filters-data.service';

@Injectable()
export class FiltersService {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _filtersDataService = inject(FiltersDataService);
    private readonly _filtersFormService = inject(FiltersFormService);

    technologies: Technology[] = [];
    locations: LookupItem[] = [];
    workModes: LookupItem[] = [];
    experienceLevels: LookupItem[] = [];
    employmentTypes: LookupItem[] = [];

    private filtersInitialized = new BehaviorSubject(false);
    filtersInitialized$ = this.filtersInitialized.asObservable();

    filtersChanged$ = this._filtersFormService.filtersChanged$;

    constructor() {
        this.fetchData();
    }

    private fetchData(): void {
        forkJoin([
            this._filtersDataService.getTechnologies().pipe(catchError(() => of([]))),
            this._filtersDataService.getLocations().pipe(catchError(() => of([]))),
            this._filtersDataService.getWorkModes().pipe(catchError(() => of([]))),
            this._filtersDataService.getExperienceLevels().pipe(catchError(() => of([]))),
            this._filtersDataService.getEmploymentTypes().pipe(catchError(() => of([]))),
        ])
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(([technologies, locations, workModes, experienceLevels, employmentTypes]) => {
                this.technologies = technologies;
                this.locations = locations;
                this.workModes = workModes;
                this.experienceLevels = experienceLevels;
                this.employmentTypes = employmentTypes;

                this.initFiltersForm();
                this._filtersFormService.startTrackingValueChange();
                this.filtersInitialized.next(true);
            });
    }

    private initFiltersForm(): void {
        this._filtersFormService.fillDynamicFiltersForm(this.technologies, 'technologies');
        this._filtersFormService.fillDynamicFiltersForm(this.locations, 'locations');
        this._filtersFormService.fillDynamicFiltersForm(this.workModes, 'workModes');
        this._filtersFormService.fillDynamicFiltersForm(this.experienceLevels, 'experienceLevels');
        this._filtersFormService.fillDynamicFiltersForm(this.employmentTypes, 'employmentTypes');
    }

    resetFiltersForm(): void {
        this._filtersFormService.stopTrackingValueChange();
        this._filtersFormService.salaryFilterModel.set(Salary.default());
        this._filtersFormService.dynamicFiltersModel.set(DynamicFilters.default());
        this.initFiltersForm();
        this._filtersFormService.changeFilters();
        this._filtersFormService.startTrackingValueChange();
    }

    getFilterParams(): FilterParams {
        const salary = this._filtersFormService.salaryFilterModel();
        return {
            salaryMin: salary.from !== Salary.SalaryFrom ? salary.from : undefined,
            salaryMax: salary.to !== Salary.SalaryFrom ? salary.to : undefined,
            technologyId: this.getFiltersFromCollection(this.technologies, 'technologies'),
            locationId: this.getFiltersFromCollection(this.locations, 'locations'),
            workModeId: this.getFiltersFromCollection(this.workModes, 'workModes'),
            experienceLevelId: this.getFiltersFromCollection(this.experienceLevels, 'experienceLevels'),
            employmentTypeId: this.getFiltersFromCollection(this.employmentTypes, 'employmentTypes'),
        };
    }

    private getFiltersFromCollection(collection: LookupItem[], filterName: keyof DynamicFilters)
        : string[] {
        const filter = this._filtersFormService.dynamicFiltersModel()[filterName];
        return filter.reduce<string[]>((accumulator, currentValue, index) => {
            if (currentValue) {
                accumulator.push(collection[index].id);
            }
            return accumulator;
        }, []);
    }
}
