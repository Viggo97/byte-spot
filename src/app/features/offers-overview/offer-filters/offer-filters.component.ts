import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { TranslatePipe } from '@core';
import { SliderComponent, CheckboxComponent } from '@shared';
import { OffersService } from '@app/features/offers-overview/offers.service';
import { Location } from '../interfaces/location.interface';
import { LocationControl } from '../types/location-control.type';

@Component({
    selector: 'bsa-offer-filters',
    standalone: true,
    imports: [
        TranslatePipe,
        SliderComponent,
        CheckboxComponent,
        FormsModule,
        ReactiveFormsModule,
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
    });

    locations: LocationControl[] = [];

    ngOnInit(): void {
        this.fetchFilterData();
        this.form.valueChanges.subscribe((v) => {
            console.log('value change', v);
        });
    }

    private fetchFilterData(): void {
        forkJoin([
            this.offerService.getCities(),
        ]).subscribe(([locations]) => {
            this.initLocations(locations);
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
}
