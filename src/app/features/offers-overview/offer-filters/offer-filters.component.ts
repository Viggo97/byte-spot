import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { TranslatePipe } from '@core';
import { SliderComponent, CheckboxComponent, IconComponent } from '@shared';
import { OffersService } from '@app/features/offers-overview/offers.service';
import { ToggleComponent } from '@app/shared/components/toggle/toggle.component';
import { Location } from '../interfaces/location.interface';
import { LocationControl } from '../types/location-control.type';
import { Technology } from '../interfaces/technology.interface';
import { TechnologyControl } from '../types/technology-control.type';

@Component({
    selector: 'bsa-offer-filters',
    standalone: true,
    imports: [
        TranslatePipe,
        SliderComponent,
        CheckboxComponent,
        FormsModule,
        ReactiveFormsModule,
        ToggleComponent,
        IconComponent,
    ],
    templateUrl: './offer-filters.component.html',
    styleUrl: './offer-filters.component.scss',
})
export class OfferFiltersComponent implements OnInit {
    private fb = inject(FormBuilder);
    private offerService = inject(OffersService);

    form = this.fb.group({
        salary: [[4500, 21000]],
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
        technologies: this.fb.array<FormControl<boolean>>([]),
    });

    locations: LocationControl[] = [];
    technologies: TechnologyControl[] = [];

    ngOnInit(): void {
        this.fetchFilterData();
        this.form.valueChanges.subscribe((v) => {
            console.log('value change', v);
        });
    }

    private fetchFilterData(): void {
        forkJoin([
            this.offerService.getCities(),
            this.offerService.getTechnologies(),
        ]).subscribe(([locations, technologies]) => {
            this.initLocations(locations);
            this.initTechnologies(technologies);
        });
    }

    private initLocations(locations: Location[]): void {
        const locationsControl = this.form.get('locations') as FormArray<FormControl<boolean>>;
        locations.forEach((location) => {
            const control = this.fb.nonNullable.control(false);
            locationsControl.push(control, { emitEvent: false });
            this.locations.push({
                id: location.id,
                name: location.name,
                control,
            });
        });
    }

    private initTechnologies(technologies: Technology[]): void {
        const technologiesControl = this.form.get('technologies') as FormArray<FormControl<boolean>>;
        technologies.forEach((technology) => {
            const control = this.fb.nonNullable.control(false);
            technologiesControl.push(control, { emitEvent: false });
            this.technologies.push({
                id: technology.id,
                name: technology.name,
                control,
            });
        });
        console.log(this.technologies);
    }
}
