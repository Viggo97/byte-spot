import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { CheckboxComponent } from '@byte-spot-lib';
import { TranslatePipe } from '@core';
import { ContractUnitService } from './contract-unit/contract-unit.service';
import { OfferCreateContractUnitComponent } from './contract-unit/contract-unit.component';
import { ContractDto } from './contract-dto.interface';

@Component({
    selector: 'bsa-offer-create-contract',
    imports: [
        FormField,
        CheckboxComponent,
        TranslatePipe,
        OfferCreateContractUnitComponent,
    ],
    templateUrl: './contract.component.html',
    styleUrls: [
        '../shared/create-section.scss',
        './contract.component.scss',
    ],
    providers: [ContractUnitService],
})
export class OfferCreateContractComponent {
    private readonly _contractUnitService = inject(ContractUnitService);

    contractUnitComponent = viewChild.required(OfferCreateContractUnitComponent);

    employmentTypes = this._contractUnitService.employmentTypes;

    protected employmentTypeModel = this._contractUnitService.employmentTypeModel;

    protected employmentTypeForm = form(
        this.employmentTypeModel,
        (schemaPath) => {
            validate(schemaPath.employmentTypes, ({ value }) => {
                const anyEmploymentTypeSelected = value().some(v => v);
                if (!anyEmploymentTypeSelected) {
                    return {
                        kind: 'atLeastOneEmploymentTypeRequired',
                        message: 'offer.atLeastOneEmploymentTypeRequired',
                    };
                }
                return null;
            });
        },
    );

    protected employmentTypesTouched = signal(false);

    formInvalid = computed(() => this.employmentTypeForm().invalid());

    constructor() {
        effect(() => {
            const employmentTypes = this.employmentTypeForm.employmentTypes().value();
            const anyEmploymentTypeChecked = employmentTypes.some(v => v);
            if (anyEmploymentTypeChecked) {
                this.employmentTypesTouched.set(true);
            }
        });
    }

    getDto(): ContractDto[] {
        return this.contractUnitComponent().getDto();
    }
}
