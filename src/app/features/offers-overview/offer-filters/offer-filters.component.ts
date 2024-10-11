import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { forkJoin } from 'rxjs';

import { TranslatePipe, CoreValue } from '@core';
import { DrawerComponent } from '@shared';
import { OfferFilters } from './offer-filters.model';
import { OffersService } from '../offers.service';
import { ControlValue } from '../types/control-value.type';
import { OfferFiltersCompactComponent } from './offer-filters-compact/offer-filters-compact.component';
import { OfferFiltersContentComponent } from './offer-filters-content/offer-filters-content.component';
import { OfferFiltersBroadComponent } from './offer-filters-broad/offer-filters-broad.component';

@Component({
    selector: 'bsa-offer-filters',
    standalone: true,
    imports: [
        TranslatePipe,
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        DrawerComponent,
        OfferFiltersContentComponent,
        OfferFiltersBroadComponent,
        OfferFiltersCompactComponent,
    ],
    templateUrl: './offer-filters.component.html',
    styleUrl: './offer-filters.component.scss',
})
export class OfferFiltersComponent implements OnInit {
    private fb = inject(FormBuilder);
    private offerService = inject(OffersService);

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

    locations: ControlValue[] = [];
    technologies: ControlValue[] = [];

    filterValues: OfferFilters | null = null;

    ngOnInit(): void {
        this.fetchFilterData();
        this.form.valueChanges.subscribe(() => {
            this.mapFormValuesToFilters();
            this.filtersChange.emit(this.filterValues!);
        });
    }

    private fetchFilterData(): void {
        forkJoin([
            this.offerService.getCities(),
            this.offerService.getTechnologies(),
        ]).subscribe(([locations, technologies]) => {
            this.createLocations(locations);
            this.createTechnologies(technologies);
        });
    }

    private createLocations(locations: CoreValue[]): void {
        const locationsControl = this.form.get('locations') as FormArray<FormControl<boolean>>;
        this.locations = this.createDynamicFilterData(locations, locationsControl);
    }

    private createTechnologies(technologies: CoreValue[]): void {
        const technologiesControl = this.form.get('technologies') as FormArray<FormControl<boolean>>;
        this.technologies = this.createDynamicFilterData(technologies, technologiesControl);
    }

    private createDynamicFilterData(data: CoreValue[], parentControl: FormArray<FormControl<boolean>>): ControlValue[] {
        const convertedData: ControlValue[] = [];
        data.forEach((entry) => {
            const control = this.fb.nonNullable.control(false);
            parentControl.push(control, { emitEvent: false });
            convertedData.push({
                key: entry.key,
                value: entry.value,
                control,
            });
        });
        return convertedData;
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
        const controlNames = control.value;
        Object.keys(controlNames).forEach((name) => {
            const value = control.get(name)?.getRawValue();
            if (value) {
                selectedValues.push(name);
            }
        });
        return selectedValues;
    }
}
