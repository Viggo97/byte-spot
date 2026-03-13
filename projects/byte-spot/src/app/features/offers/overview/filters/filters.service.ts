import { inject, Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { LookupItem } from '@app/shared/models/lookup-item.interface';
import { Technology } from './models/technology.interface';
import { FiltersFormService } from './form/filters-form.service';
import { FilterParams } from './models/filter-params.interface';

@Injectable()
export class FiltersService {
    private filtersFormService = inject(FiltersFormService);

    technologies: Technology[] = [];
    locations: LookupItem[] = [];
    workModes: LookupItem[] = [];
    experienceLevels: LookupItem[] = [];
    employmentTypes: LookupItem[] = [];

    private filtersChanged = new Subject<void>();
    filtersChanged$ = this.filtersChanged.asObservable();

    initFilters(technologies: Technology[], locations: LookupItem[] = [], workModes: LookupItem[],
        experienceLevels: LookupItem[], employmentTypes: LookupItem[]): void {
        this.technologies = technologies;
        this.locations = locations;
        this.workModes = workModes;
        this.experienceLevels = experienceLevels;
        this.employmentTypes = employmentTypes;
        this.filtersFormService.initLookupFiltersForm(this.technologies, 'technologies');
        this.filtersFormService.initLookupFiltersForm(this.locations, 'locations');
        this.filtersFormService.initLookupFiltersForm(this.workModes, 'workModes');
        this.filtersFormService.initLookupFiltersForm(this.experienceLevels, 'experienceLevels');
        this.filtersFormService.initLookupFiltersForm(this.employmentTypes, 'employmentTypes');
    }

    getFilterParams(): FilterParams {
        const form = this.filtersFormService.getFormValue();
        const defaultSalaryFrom = this.filtersFormService.form.controls.salary.defaultValue.from;
        const defaultSalaryTo = this.filtersFormService.form.controls.salary.defaultValue.to;
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
        const controls = this.filtersFormService.form.controls;
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

    changeFilters(): void {
        this.filtersChanged.next();
    }
}
