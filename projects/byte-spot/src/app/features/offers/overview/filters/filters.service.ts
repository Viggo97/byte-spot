import { DestroyRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, forkJoin, of, skip, Subject, tap } from 'rxjs';
import { isNumber, stringArraysEqual } from '@byte-spot-lib';
import { LookupItem } from '@shared';
import { Salary } from './models/salary.model';
import { DynamicFilters } from './models/dynamic-filters.model';
import { Technology } from './models/technology.interface';
import { FilterParams } from './models/filter-params.interface';
import { FiltersFormService } from './form/filters-form.service';
import { FiltersDataService } from './data/filters-data.service';

@Injectable()
export class FiltersService {
    private readonly _route = inject(ActivatedRoute);
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

    private filtersChanged = new Subject<void>();
    filtersChanged$ = this.filtersChanged.asObservable();

    constructor() {
        this.fetchData();
        this.subscribeToFormFiltersChange();
        this.subscribeToQueryParamsChanges();
    }

    getFilterParams(): FilterParams {
        return this.getFilterParamsFromForm();
    }

    getFilterParamsFromQuery(): FilterParams {
        const queryParams = this._route.snapshot.queryParams;
        return {
            salaryMin: isNumber(queryParams['salaryMin']) ? +queryParams['salaryMin'] : undefined,
            salaryMax: isNumber(queryParams['salaryMax']) ? +queryParams['salaryMax'] : undefined,
            technologyId: queryParams['technologyId'] as string[] | undefined ?? [],
            locationId: queryParams['locationId'] as string[] | undefined ?? [],
            workModeId: queryParams['workModeId'] as string[] | undefined ?? [],
            experienceLevelId: queryParams['experienceLevelId'] as string[] | undefined ?? [],
            employmentTypeId: queryParams['employmentTypeId'] as string[] | undefined ?? [],
        };
    }

    getFilterParamsFromForm(): FilterParams {
        const salary = this._filtersFormService.salaryFilterModel();
        return {
            salaryMin: salary.from !== Salary.SalaryFrom ? salary.from : undefined,
            salaryMax: salary.to !== Salary.SalaryTo ? salary.to : undefined,
            technologyId: this.getCheckedDynamicFilters(this.technologies, 'technologies'),
            locationId: this.getCheckedDynamicFilters(this.locations, 'locations'),
            workModeId: this.getCheckedDynamicFilters(this.workModes, 'workModes'),
            experienceLevelId: this.getCheckedDynamicFilters(this.experienceLevels, 'experienceLevels'),
            employmentTypeId: this.getCheckedDynamicFilters(this.employmentTypes, 'employmentTypes'),
        };
    }

    resetFiltersForm(): void {
        this._filtersFormService.stopTrackingValueChange();
        this._filtersFormService.salaryFilterModel.set(Salary.default());
        this.resetDynamicFilters();
        this._filtersFormService.startTrackingValueChange();
        this.filtersChanged.next();
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

                this.setFiltersForm();
                this.filtersInitialized.next(true);
            });
    }

    private subscribeToFormFiltersChange(): void {
        this._filtersFormService.filtersChanged$
            .pipe(
                tap(() => {
                    this.filtersChanged.next();
                }),
                takeUntilDestroyed(this._destroyRef),
            ).subscribe();
    }

    private subscribeToQueryParamsChanges(): void {
        this._route.queryParamMap
            .pipe(
                skip(1),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe(() => {
                if (!this.isFormEqualsQuery()) {
                    this.setFiltersForm();
                }
            });
    }

    private isFormEqualsQuery(): boolean {
        const formValues = this.getFilterParamsFromForm();
        const queryValues = this.getFilterParamsFromQuery();

        return !(formValues.salaryMin !== queryValues.salaryMin ||
            formValues.salaryMax !== queryValues.salaryMax ||
            !stringArraysEqual(formValues.technologyId, queryValues.technologyId) ||
            !stringArraysEqual(formValues.locationId, queryValues.locationId) ||
            !stringArraysEqual(formValues.workModeId, queryValues.workModeId) ||
            !stringArraysEqual(formValues.employmentTypeId, queryValues.employmentTypeId) ||
            !stringArraysEqual(formValues.experienceLevelId, queryValues.experienceLevelId));
    }

    private setFiltersForm(): void {
        this._filtersFormService.stopTrackingValueChange();

        const queryParams = this._route.snapshot.queryParams;

        const salaryMin = isNumber(queryParams['salaryMin']) ? +queryParams['salaryMin'] : Salary.SalaryFrom;
        const salaryMax = isNumber(queryParams['salaryMax']) ? +queryParams['salaryMax'] : Salary.SalaryTo;
        this._filtersFormService.salaryFilterForm.from().value.set(salaryMin);
        this._filtersFormService.salaryFilterForm.to().value.set(salaryMax);

        const technologyIdValues = this.getDynamicValuesFromQuery('technologyId', this.technologies);
        this._filtersFormService.setDynamicFilterValues('technologies', technologyIdValues);

        const locationIdValues = this.getDynamicValuesFromQuery('locationId', this.locations);
        this._filtersFormService.setDynamicFilterValues('locations', locationIdValues);

        const workModeIdValues = this.getDynamicValuesFromQuery('workModeId', this.workModes);
        this._filtersFormService.setDynamicFilterValues('workModes', workModeIdValues);

        const experienceLevelIdValues = this.getDynamicValuesFromQuery('experienceLevelId', this.experienceLevels);
        this._filtersFormService.setDynamicFilterValues('experienceLevels', experienceLevelIdValues);

        const employmentTypeIdValues = this.getDynamicValuesFromQuery('employmentTypeId', this.employmentTypes);
        this._filtersFormService.setDynamicFilterValues('employmentTypes', employmentTypeIdValues);

        this._filtersFormService.startTrackingValueChange();
    }

    private getDynamicValuesFromQuery(paramName: keyof FilterParams, items: LookupItem[]): boolean[] {
        const queryParams = this._route.snapshot.queryParams;
        const paramValues = queryParams[paramName] as string[] | undefined;
        return items.map(i => paramValues?.includes(i.id) ?? false);
    }

    private resetDynamicFilters(): void {
        this._filtersFormService.dynamicFiltersModel.set(DynamicFilters.default());
        this._filtersFormService.resetDynamicFilterValues('technologies', this.technologies.length);
        this._filtersFormService.resetDynamicFilterValues('locations', this.locations.length);
        this._filtersFormService.resetDynamicFilterValues('workModes', this.workModes.length);
        this._filtersFormService.resetDynamicFilterValues('experienceLevels', this.experienceLevels.length);
        this._filtersFormService.resetDynamicFilterValues('employmentTypes', this.employmentTypes.length);
    }

    private getCheckedDynamicFilters(collection: LookupItem[], filterName: keyof DynamicFilters)
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
