import { Component, input } from '@angular/core';
import { IconCapGraduationComponent, IconLocationComponent, IconMoneyComponent } from 'ngx-bsl';
import { TranslatePipe } from '@core';
import { Salary } from '../models/salary.interface';
import { BillingUnit } from '../models/billing-unit.enum';
import { SalaryType } from '../models/salary-type.enum';

@Component({
    selector: 'bsa-offers-details-info',
    imports: [
        IconMoneyComponent,
        IconLocationComponent,
        IconCapGraduationComponent,
        TranslatePipe,
    ],
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss',
})
export class InfoComponent {
    salaries = input.required<Salary[]>();
    locations = input.required<string[]>();
    workModes = input.required<string[]>();
    experienceLevels = input.required<string[]>();

    protected readonly BillingUnit = BillingUnit;
    protected readonly SalaryType = SalaryType;
}
