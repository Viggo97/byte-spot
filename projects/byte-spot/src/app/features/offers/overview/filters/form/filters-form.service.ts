import { computed, Injectable, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { StrictOmit } from '@byte-spot-lib';
import { LookupItem } from '@shared';
import { Filters } from '../models/filters.model';

@Injectable()
export class FiltersFormService {
    filtersModel = signal(Filters.default());
    filtersForm = form(this.filtersModel);

    salaryFilter = computed(() => this.filtersModel().salary);
    private locationsFilter = computed(() => this.filtersModel().locations);
    private technologiesFilter = computed(() => this.filtersModel().technologies);
    private workModesFilter = computed(() => this.filtersModel().workModes);
    private experienceLevelsFilter = computed(() => this.filtersModel().experienceLevels);
    private employmentTypes = computed(() => this.filtersModel().employmentTypes);
    collectionFilters = computed(() => ({
        locations: this.locationsFilter(),
        technologies: this.technologiesFilter(),
        workModes: this.workModesFilter(),
        experienceLevels: this.experienceLevelsFilter(),
        employmentTypes: this.employmentTypes(),
    }));

    fillCollectionFiltersForm(items: LookupItem[], filterName: keyof StrictOmit<Filters, 'salary'>): void {
        const cleanArray = new Array<boolean>(items.length).fill(false);
        this.filtersForm[filterName]().value.set(cleanArray);
    }

    getFormValue(): Filters {
        return this.filtersForm().value();
    }
}
