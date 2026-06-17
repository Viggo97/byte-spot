import { Component, computed, effect, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, validate } from '@angular/forms/signals';
import { CheckboxComponent } from '@byte-spot-lib';
import { TranslatePipe } from '@core';
import { LookupItem } from '@shared';
import { OfferCreateService } from '../create.service';
import { BaseDto } from './base-dto.interface';

interface BaseModel {
    title: string;
    workModes: boolean[];
    locations: boolean[];
}

@Component({
    selector: 'bsa-offers-create-base',
    imports: [
        FormField,
        CheckboxComponent,
        TranslatePipe,
    ],
    templateUrl: './base.component.html',
    styleUrls: [
        '../shared/create-section.scss',
        './base.component.scss',
    ],
})
export class OffersCreateBaseComponent {
    private readonly _createService = inject(OfferCreateService);

    protected workModes = signal<LookupItem[]>(this._createService.workModes);
    protected locations = signal<LookupItem[]>(this._createService.locations);

    protected baseModel = signal<BaseModel>({
        title: '',
        workModes: new Array<boolean>(this.workModes().length).fill(false),
        locations: new Array<boolean>(this.locations().length).fill(false),
    });

    protected baseForm = form(
        this.baseModel,
        (schemaPath) => {
            required(schemaPath.title, {message: 'offer.titleRequired'});
            minLength(schemaPath.title, 8, {message: 'offer.titleMinLength'});
            maxLength(schemaPath.title, 128, {message: 'offer.titleMaxLength'});

            validate(schemaPath.workModes, ({value}) => {
                const anyWorkModeSelected = value().some(v => v);
                if (!anyWorkModeSelected) {
                    return {
                        kind: 'atLeastOneWorkModeRequired',
                        message: 'offer.atLeastOneWorkModeRequired',
                    };
                }
                return null;
            });

            validate(schemaPath.locations, ({value}) => {
                const isAnyLocationSelected = value().some(v => v);
                if (!isAnyLocationSelected) {
                    return {
                        kind: 'atLeastOneLocationRequired',
                        message: 'offer.atLeastOneLocationRequired',
                    };
                }
                return null;
            });

        },
    );

    protected workModesTouched = signal(false);
    protected locationsTouched = signal(false);

    formInvalid = computed(() => this.baseForm().invalid());

    constructor() {
        effect(() => {
            const workModes = this.baseForm.workModes().value();
            const anyWorkModeChecked = workModes.some(v => v);
            if (anyWorkModeChecked) {
                this.workModesTouched.set(true);
            }
        });

        effect(() => {
            const locations = this.baseForm.locations().value();
            const anyLocationChecked = locations.some(v => v);
            if (anyLocationChecked) {
                this.locationsTouched.set(true);
            }
        });
    }

    getDto(): BaseDto {
        const workModeItems = this.workModes();
        const locationItems = this.locations();
        const workModesState = this.baseForm.workModes().value();
        const locationsState = this.baseForm.locations().value();

        const workModeIds = workModeItems.map((workMode) => workMode.id).filter((_, i) => workModesState.at(i));
        const locationsIds = locationItems.map((location) => location.id).filter((_, i) => locationsState.at(i));
        const title = this.baseForm.title().value();

        return {
            title,
            workModes: workModeIds,
            locations: locationsIds,
        };
    }
}
