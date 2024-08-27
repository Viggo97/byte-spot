import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';

import { SelectComponent } from '@shared';
import { TranslateService } from '@core';

import { SortType } from './offer-sort.enum';

type SortOption = {
    key: string;
    label: string
};

@Component({
    selector: 'bsa-offer-settings-sort',
    standalone: true,
    imports: [
        FormsModule,
        SelectComponent,
    ],
    templateUrl: './offer-settings-sort.component.html',
    styleUrl: './offer-settings-sort.component.scss',
})
export class OfferSettingsSortComponent {
    private translateService = inject(TranslateService);
    private breakpointObserver = inject(BreakpointObserver);

    sortDropdownWidth: 'auto' | undefined;
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
        this.breakpointObserver
            .observe('(min-width: 600px)')
            .pipe(takeUntilDestroyed())
            .subscribe((state) => {
                this.sortDropdownWidth = state.matches ? 'auto' : undefined;
            });
    }
}
