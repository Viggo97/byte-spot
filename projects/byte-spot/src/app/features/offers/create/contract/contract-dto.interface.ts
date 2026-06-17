export interface ContractDto {
    employmentTypeId: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryFixed?: number;
    salaryType: string;
    currencyCode: string;
    billingUnit: string;
}
