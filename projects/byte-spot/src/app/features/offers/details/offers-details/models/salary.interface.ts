import { BillingUnit } from './billing-unit.enum';
import { SalaryType } from './salary-type.enum';

export interface Salary {
    min?: number;
    max?: number;
    fixed?: number;
    type: SalaryType;
    currency: string;
    billingUnit: BillingUnit;
    employmentType: string;
}
