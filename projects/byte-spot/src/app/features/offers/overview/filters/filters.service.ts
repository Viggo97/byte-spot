import { DestroyRef, inject, Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of, Subject } from 'rxjs';
import { LookupItem } from '@app/shared/models/lookup-item.interface';
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

    private filtersInitialized = new Subject<void>();
    filtersInitialized$ = this.filtersInitialized.asObservable();

    private filtersChanged = new Subject<void>();
    filtersChanged$ = this.filtersChanged.asObservable();

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

                this.filtersInitialized.next();
                this.filtersInitialized.complete();
            });
    }

    private initFiltersForm(): void {
        this._filtersFormService.initLookupFiltersForm(this.technologies, 'technologies');
        this._filtersFormService.initLookupFiltersForm(this.locations, 'locations');
        this._filtersFormService.initLookupFiltersForm(this.workModes, 'workModes');
        this._filtersFormService.initLookupFiltersForm(this.experienceLevels, 'experienceLevels');
        this._filtersFormService.initLookupFiltersForm(this.employmentTypes, 'employmentTypes');
    }

    changeFilters(): void {
        this.filtersChanged.next();
    }

    getFilterParams(): FilterParams {
        const form = this._filtersFormService.getFormValue();
        const defaultSalaryFrom = this._filtersFormService.form.controls.salary.defaultValue.from;
        const defaultSalaryTo = this._filtersFormService.form.controls.salary.defaultValue.to;
        return {
            salaryMin: form.salary.from !== defaultSalaryFrom ? form.salary.from : undefined,
            salaryMax: form.salary.to !== defaultSalaryTo ? form.salary.to : undefined,
            technologyId: this.getFiltersFromCollection(this.technologies, 'technologies'),
            locationId: this.getFiltersFromCollection(this.locations, 'locations'),
            workModeId: this.getFiltersFromCollection(this.workModes, 'workModes'),
            experienceLevelId: this.getFiltersFromCollection(this.experienceLevels, 'experienceLevels'),
            employmentTypeId: this.getFiltersFromCollection(this.employmentTypes, 'employmentTypes'),
        };
    }

    private getFiltersFromCollection(collection: LookupItem[], controlName: string): string[] {
        const controls = this._filtersFormService.form.controls;
        if (controlName in controls) {
            const formControl = controls[controlName as keyof typeof controls];
            if (formControl instanceof FormArray) {
                return collection
                    .filter((_value, index) => formControl.at(index).getRawValue())
                    .map(value => value.id);
            }
            return [];
        }
        return [];
    }
}
