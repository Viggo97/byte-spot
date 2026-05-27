import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, of, Subject } from 'rxjs';
import { StrictOmit } from '@byte-spot-lib';
import { LookupItem } from '@shared';
import { Filters } from './models/filters.model';
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

    preventFormValueChange = false;

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
        this._filtersFormService.fillCollectionFiltersForm(this.technologies, 'technologies');
        this._filtersFormService.fillCollectionFiltersForm(this.locations, 'locations');
        this._filtersFormService.fillCollectionFiltersForm(this.workModes, 'workModes');
        this._filtersFormService.fillCollectionFiltersForm(this.experienceLevels, 'experienceLevels');
        this._filtersFormService.fillCollectionFiltersForm(this.employmentTypes, 'employmentTypes');
    }

    resetFiltersForm(): void {
        this.preventFormValueChange = true;
        this._filtersFormService.filtersModel.set(Filters.default());
        this.initFiltersForm();
        this.changeFilters();
        setTimeout(() => this.preventFormValueChange = false);
    }

    changeFilters(): void {
        this.filtersChanged.next();
    }

    getFilterParams(): FilterParams {
        const form = this._filtersFormService.getFormValue();
        return {
            salaryMin: form.salary.from !== Filters.SalaryFrom ? form.salary.from : undefined,
            salaryMax: form.salary.to !== Filters.SalaryFrom ? form.salary.to : undefined,
            technologyId: this.getFiltersFromCollection(this.technologies, 'technologies'),
            locationId: this.getFiltersFromCollection(this.locations, 'locations'),
            workModeId: this.getFiltersFromCollection(this.workModes, 'workModes'),
            experienceLevelId: this.getFiltersFromCollection(this.experienceLevels, 'experienceLevels'),
            employmentTypeId: this.getFiltersFromCollection(this.employmentTypes, 'employmentTypes'),
        };
    }

    private getFiltersFromCollection(collection: LookupItem[], filterName: keyof StrictOmit<Filters, 'salary'>)
        : string[] {
        const filter = this._filtersFormService.filtersModel()[filterName];
        return filter.reduce<string[]>((accumulator, currentValue, index) => {
            if (currentValue) {
                accumulator.push(collection[index].id);
            }
            return accumulator;
        }, []);
    }
}
