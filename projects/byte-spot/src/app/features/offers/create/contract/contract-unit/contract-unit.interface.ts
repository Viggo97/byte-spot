import { EmploymentType } from '@app/features/offers/shared/enums/employment-type.enum';
import { SalaryType } from '@app/features/offers/shared/enums/salary-type.enum';
import { CurrencyCode } from '@app/features/offers/shared/enums/currency-code.enum';
import { BillingUnit } from '@app/features/offers/shared/enums/billing-unit.enum';

export interface ContractUnit {
    employmentTypeId: EmploymentType;
    employmentTypeName: string;
    hasFixedSalary: boolean;
    salaryMin: number;
    salaryMax: number;
    salaryFixed: number;
    salaryType: {value: SalaryType; name: string};
    currencyCode: {value: CurrencyCode; name: string};
    billingUnit: {value: BillingUnit; name: string};
}
