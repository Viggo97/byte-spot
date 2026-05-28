import { Component, input } from '@angular/core';
import { NumberFormatterPipe, SvgIconComponent } from '@shared';
import { TranslatePipe } from '@core';
import { Salary } from '@app/features/offers/shared/models/salary.interface';
import { SalaryType } from '@app/features/offers/shared/enums/salary-type.enum';
import { BillingUnit } from '@app/features/offers/shared/enums/billing-unit.enum';

@Component({
    selector: 'bsa-offers-details-info',
    imports: [
        TranslatePipe,
        NumberFormatterPipe,
        SvgIconComponent,
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
