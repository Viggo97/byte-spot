import { EmploymentType } from '@app/features/offers/shared/enums/employment-type.enum';
import { BillingUnit } from '../enums/billing-unit.enum';
import { CurrencyCode } from '../enums/currency-code.enum';
import { SalaryType } from '../enums/salary-type.enum';

export interface Salary {
    min?: number;
    max?: number;
    fixed?: number;
    type: SalaryType;
    currencyCode: CurrencyCode;
    billingUnit: BillingUnit;
    employmentType: {
        id: EmploymentType;
        value: string;
    };
}
