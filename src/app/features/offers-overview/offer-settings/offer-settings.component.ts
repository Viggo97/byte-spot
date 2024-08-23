import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslatePipe, TranslateService } from '@core';
import { SelectComponent } from '@shared';
import { SortType } from './offer-sort.enum';

type SortOption = {
    key: string;
    label: string
};

@Component({
    selector: 'bsa-offer-settings',
    standalone: true,
    imports: [
        FormsModule,
        TranslatePipe,
        SelectComponent,
    ],
    templateUrl: './offer-settings.component.html',
    styleUrl: './offer-settings.component.scss',
})
export class OfferSettingsComponent {
    translateService = inject(TranslateService);

    offers = 12345;

    sort: SortOption;

    sortOptions: SortOption[] = [
        {
            key: SortType.NEWEST,
            label: this.translateService.translate('offer.newest'),
        },
        {
            key: SortType.HIGHEST_SALARY,
            label: this.translateService.translate('offer.highestSalary'),
        },
        {
            key: SortType.LOWEST_SALARY,
            label: this.translateService.translate('offer.lowestSalary'),
        },
    ];

    constructor() {
        [this.sort] = this.sortOptions;
    }
}
