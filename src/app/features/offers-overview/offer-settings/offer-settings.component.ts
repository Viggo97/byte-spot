import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';

import { TranslatePipe, TranslateService } from '@core';
import { NumberFormatterPipe, SelectComponent } from '@shared';
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
        NumberFormatterPipe,
        SelectComponent,
    ],
    templateUrl: './offer-settings.component.html',
    styleUrl: './offer-settings.component.scss',
})
export class OfferSettingsComponent {
    translateService = inject(TranslateService);

    offers = 12399999;

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

    constructor(private breakpointObserver: BreakpointObserver) {
        [this.sort] = this.sortOptions;
        this.breakpointObserver
            .observe('(min-width: 600px)')
            .pipe(takeUntilDestroyed())
            .subscribe((state) => {
                this.sortDropdownWidth = state.matches ? 'auto' : undefined;
            });
    }
}
