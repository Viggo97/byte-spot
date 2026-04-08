import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { OfferDetails } from './models/offer-details.interface';
import { SalaryType } from '@app/features/offers/shared/enums/salary-type.enum';
import { BillingUnit } from '@app/features/offers/shared/enums/billing-unit.enum';
import { CurrencyCode } from '@app/features/offers/shared/enums/currency-code.enum';
import { EmploymentType } from '@app/features/offers/shared/enums/employment-type.enum';

@Injectable()
export class OfferDetailsDataService {
    private readonly _http = inject(HttpClient);

    private readonly URL = environment.apiUrl;

    getOfferDetails(id: string): Observable<OfferDetails> {
        const url = this.URL + '/offers' + id;
        return of({
            title: 'Senior Software Developer',
            company: {
                id: 'ASDF',
                name: 'Microsoft',
            },
            locations: ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań', 'Katowice'],
            technologies: ['C#', 'ASP.NET', 'MSSQL'],
            workModes: ['Remote', 'Hybrid', 'On Site'],
            experienceLevels: ['Regular', 'Senior'],
            validFrom: 1774617020287,
            validTo: 1774649151304,
            description: 'Example description',
            salaries: [
                {
                    min: 7000,
                    max: 12000,
                    fixed: undefined,
                    type: SalaryType.GROSS,
                    currencyCode: CurrencyCode.PLN,
                    employmentType: {
                        id: EmploymentType.EmploymentContract,
                        value: 'Employment contract',
                    },
                    billingUnit: BillingUnit.MONTH,
                },
                {
                    min: 110,
                    max: 130,
                    fixed: undefined,
                    type: SalaryType.NET,
                    currencyCode: CurrencyCode.PLN,
                    employmentType: {
                        id: EmploymentType.B2B,
                        value: 'B2B',
                    },
                    billingUnit: BillingUnit.HOUR,
                },
            ],
        }).pipe(delay(499));
        // return this._http.get<OfferDetails>(url);
    }
}
