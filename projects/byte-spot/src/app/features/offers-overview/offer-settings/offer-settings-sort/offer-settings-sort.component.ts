import { Component, Output, inject, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';

import { SelectComponent } from '@shared';
import { TranslateService } from '@core';

import { OfferSort } from '../../enums/offer-sort.enum';

type SortOption = {
    key: OfferSort;
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

    @Input() sort?: OfferSort;
    @Output() sortChange = new EventEmitter<OfferSort>();

    sortDropdownWidth: 'auto' | undefined;
    sortOption: SortOption;
    sortOptions: SortOption[] = [
        {
            key: OfferSort.NEWEST,
            label: this.translateService.translate('offer.newest'),
        },
        {
            key: OfferSort.HIGHEST_SALARY,
            label: this.translateService.translate('offer.highestSalary'),
        },
        {
            key: OfferSort.LOWEST_SALARY,
            label: this.translateService.translate('offer.lowestSalary'),
        },
    ];

    constructor() {
        this.sortOption = this.sortOptions.find((option) => option.key === this.sort) || this.sortOptions[0];
        this.breakpointObserver
            .observe('(min-width: 600px)')
            .pipe(takeUntilDestroyed())
            .subscribe((state) => {
                this.sortDropdownWidth = state.matches ? 'auto' : undefined;
            });
    }

    onSortChange(sortOption: SortOption): void {
        this.sortChange.emit(sortOption.key);
    }
}
