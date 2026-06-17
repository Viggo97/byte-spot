import { Component, effect, inject, signal, untracked } from '@angular/core';
import { applyEach, form, FormField } from '@angular/forms/signals';
import { TranslatePipe, TranslateService } from '@core';
import { SalaryType } from '@app/features/offers/shared/enums/salary-type.enum';
import { CurrencyCode } from '@app/features/offers/shared/enums/currency-code.enum';
import { BillingUnit } from '@app/features/offers/shared/enums/billing-unit.enum';
import { CheckboxComponent, ListBoxOptionComponent, SelectComponent } from '@byte-spot-lib';
import { ContractUnit } from '@app/features/offers/create/contract/contract-unit/contract-unit.interface';
import { contractUnitValidator } from '@app/features/offers/create/contract/contract-unit/contract-unit.validator';
import { ContractUnitService } from '@app/features/offers/create/contract/contract-unit/contract-unit.service';
import { EmploymentType } from '@app/features/offers/shared/enums/employment-type.enum';
import { ContractDto } from '../contract-dto.interface';

interface ContractUnitModel {
    contracts: ContractUnit[];
}

@Component({
    selector: 'bsa-offer-create-contract-unit',
    imports: [
        CheckboxComponent,
        FormField,
        TranslatePipe,
        SelectComponent,
        ListBoxOptionComponent,
    ],
    templateUrl: './contract-unit.component.html',
    styleUrl: './contract-unit.component.scss',
})
export class OfferCreateContractUnitComponent {
    private readonly _translateService = inject(TranslateService);
    private readonly _contractUnitService = inject(ContractUnitService);

    protected contractModel = signal<ContractUnitModel>({ contracts: [] });
    protected contractForm = form(
        this.contractModel,
        (schemaPath) => {
            applyEach(schemaPath.contracts, (contractsPath) => {
                contractUnitValidator(contractsPath);
            });
        },
    );

    protected salaryTypes = signal([
        {
            value: SalaryType.NET,
            name: this._translateService.translate('offer.net'),
        },
        {
            value: SalaryType.GROSS,
            name: this._translateService.translate('offer.gross'),
        },
    ]);

    protected currencyCodes = signal([
        {
            value: CurrencyCode.PLN,
            name: CurrencyCode.PLN.toString(),
        },
        {
            value: CurrencyCode.USD,
            name: CurrencyCode.USD.toString(),
        },
        {
            value: CurrencyCode.EUR,
            name: CurrencyCode.EUR.toString(),
        },
    ]);

    protected billingUnits = signal([
        {
            value: BillingUnit.HOUR,
            name: this._translateService.translate('offer.perHour'),
        },
        {
            value: BillingUnit.DAY,
            name: this._translateService.translate('offer.perDay'),
        },
        {
            value: BillingUnit.MONTH,
            name: this._translateService.translate('offer.perMonth'),
        },
    ]);

    constructor() {
        effect(() => {
            this.handleDynamicForm();
        });
    }

    private handleDynamicForm(): void {
        const employmentTypes = untracked(this._contractUnitService.employmentTypes);
        const employmentTypeModel = this._contractUnitService.employmentTypeModel().employmentTypes;

        const employmentTypesState = employmentTypes.map((employmentType, index)=> {
            return {
                id: employmentType.id,
                name: employmentType.name,
                isChecked: !!employmentTypeModel.at(index),
            };
        });

        employmentTypesState.forEach(checkedEmploymentType => {
            if (checkedEmploymentType.isChecked) {
                this.addContractUnitControls(checkedEmploymentType.id as EmploymentType, checkedEmploymentType.name);
            } else {
                this.removeContractUnitControls(checkedEmploymentType.id);
            }
        });
    }

    private addContractUnitControls(employmentTypeId: EmploymentType, employmentTypeName: string): void {
        const contracts = untracked(this.contractModel).contracts;
        const contractExists = !!contracts.find(c => c.employmentTypeId === employmentTypeId);
        if (contractExists) {
            return;
        }

        this.contractModel.update(v => ({
            contracts: [
                ...v.contracts,
                {
                    employmentTypeId: employmentTypeId,
                    employmentTypeName: employmentTypeName,
                    hasFixedSalary: true,
                    salaryMin: 0,
                    salaryMax: 0,
                    salaryFixed: 0,
                    salaryType: this.salaryTypes()[0],
                    currencyCode: this.currencyCodes()[0],
                    billingUnit: this.billingUnits()[0],
                },
            ],
        }));
    }

    private removeContractUnitControls(employmentTypeId: string): void {
        const contracts = untracked(this.contractModel).contracts;
        const filtered = contracts
            .filter(c => c.employmentTypeId !== (employmentTypeId as EmploymentType));
        this.contractModel.update(() => ({
            contracts: [
                ...filtered,
            ],
        }));
        return;
    }

    getDto(): ContractDto[] {
        const contractsState = this.contractForm.contracts().value();
        return contractsState.map(contract => {
            return {
                employmentTypeId: contract.employmentTypeId,
                salaryMin: contract.hasFixedSalary ? undefined : contract.salaryMin,
                salaryMax: contract.hasFixedSalary ? undefined : contract.salaryMax,
                salaryFixed: contract.hasFixedSalary ? contract.salaryFixed : undefined,
                salaryType: contract.salaryType.value,
                currencyCode: contract.currencyCode.value,
                billingUnit: contract.billingUnit.value,
            };
        });
    }
}

