import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { forkJoin } from 'rxjs';

import { TranslatePipe, CoreValue } from '@core';
import { DrawerComponent } from '@shared';
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

    form = this.fb.group({
        salary: [[0, 50000]],
        technologies: this.fb.array<FormControl<boolean>>([]),
        workMode: this.fb.group({
            onSite: false,
            hybrid: false,
            remote: false,
        }),
        locations: this.fb.array<FormControl<boolean>>([]),
        employmentType: this.fb.group({
            employmentContract: false,
            b2b: false,
            mandateContract: false,
            specificTaskContract: false,
            internship: false,
        }),
        seniority: this.fb.group({
            intern: false,
            junior: false,
            mid: false,
            senior: false,
            expert: false,
        }),
    });

    locations: ControlValue[] = [];
    technologies: ControlValue[] = [];

    ngOnInit(): void {
        this.fetchFilterData();
        this.form.valueChanges.subscribe((v) => {
            // console.log('value change', v);
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
}
