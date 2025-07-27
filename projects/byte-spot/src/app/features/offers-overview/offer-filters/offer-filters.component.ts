import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { KeyValue } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';

import { KeyValueControl, ValueControl } from '@shared';

import { OffersService } from '../offers.service';
import { OfferFilters } from './offer-filters.model';
import { OfferFiltersCompactComponent } from './offer-filters-compact/offer-filters-compact.component';
import { OfferFiltersBroadComponent } from './offer-filters-broad/offer-filters-broad.component';

@Component({
    selector: 'bsa-offer-filters',
    imports: [
        OfferFiltersBroadComponent,
        OfferFiltersCompactComponent,
    ],
    templateUrl: './offer-filters.component.html',
    styleUrl: './offer-filters.component.scss',
})
export class OfferFiltersComponent implements OnInit {
    private fb = inject(FormBuilder);
    private offerService = inject(OffersService);
    private destroyRef = inject(DestroyRef);

    @Input({ required: true }) compactMode!: boolean;

    @Output() filtersChange = new EventEmitter<OfferFilters>();

    form = this.fb.group({
        salary: this.fb.nonNullable.control([0, 50000]),
        technologies: this.fb.array<FormControl<boolean>>([]),
        workMode: this.fb.nonNullable.group({
            onSite: false,
            hybrid: false,
            remote: false,
        }),
        locations: this.fb.array<FormControl<boolean>>([]),
        employmentType: this.fb.nonNullable.group({
            employmentContract: false,
            b2b: false,
            mandateContract: false,
            specificTaskContract: false,
            internship: false,
        }),
        seniority: this.fb.nonNullable.group({
            intern: false,
            junior: false,
            mid: false,
            senior: false,
            expert: false,
        }),
    });

    locations: ValueControl<string>[] = [];
    technologies: KeyValueControl<string, string>[] = [];

    filterValues = OfferFilters.default();

    ngOnInit(): void {
        this.fetchFilterData();
        if (!this.compactMode) {
            this.form.valueChanges
                .pipe(
                    debounceTime(150),
                    distinctUntilChanged(),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe(() => {
                    this.mapFormValuesToFilters();
                    this.filtersChange.emit(this.filterValues);
                });
        }
    }

    private fetchFilterData(): void {
        forkJoin([
            this.offerService.getLocations(),
            this.offerService.getTechnologies(),
        ]).subscribe(([locations, technologies]) => {
            this.createLocations(locations);
            this.createTechnologies(technologies);
        });
    }

    private createLocations(locations: string[]): void {
        const parentControl = this.form.get('locations') as FormArray<FormControl<boolean>>;
        const convertedLocations: ValueControl<string>[] = [];
        locations.forEach((entry) => {
            const control = this.fb.nonNullable.control(false);
            parentControl.push(control, { emitEvent: false });
            convertedLocations.push({
                value: entry,
                control,
            });
        });
        this.locations = convertedLocations;
    }

    private createTechnologies(technologies: KeyValue<string, string>[]): void {
        const parentControl = this.form.get('technologies') as FormArray<FormControl<boolean>>;
        const convertedTechnologies: KeyValueControl<string, string>[] = [];
        technologies.forEach((entry) => {
            const control = this.fb.nonNullable.control(false);
            parentControl.push(control, { emitEvent: false });
            convertedTechnologies.push({
                key: entry.key,
                value: entry.value,
                control,
            });
        });
        this.technologies = convertedTechnologies;
    }

    private mapFormValuesToFilters(): void {
        const [min, max] = this.form.controls.salary.getRawValue();
        const technologies = this.technologies.filter((t) => t.control.value).map((t) => t.value);
        const locations = this.locations.filter((l) => l.control.value).map((l) => l.value);
        const workMode = this.convertCheckboxValues(this.form.controls.workMode);
        const employmentType = this.convertCheckboxValues(this.form.controls.employmentType);
        const seniority = this.convertCheckboxValues(this.form.controls.seniority);
        this.filterValues = new OfferFilters(min, max, technologies, workMode, employmentType, locations, seniority);
    }

    private convertCheckboxValues(control: FormGroup): string[] {
        const selectedValues: string[] = [];
        const controlNames = control.value as object;
        Object.keys(controlNames).forEach((name) => {
            const value = control.get(name)?.getRawValue() as string;
            if (value) {
                selectedValues.push(name);
            }
        });
        return selectedValues;
    }

    onFiltersReset(): void {
        this.form.reset();
    }

    onFiltersChange(): void {
        this.mapFormValuesToFilters();
        this.filtersChange.emit(this.filterValues);
    }
}
