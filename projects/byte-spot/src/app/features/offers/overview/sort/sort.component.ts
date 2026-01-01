import { Component, inject, output, signal } from '@angular/core';
import { ListBoxOptionComponent, SelectComponent } from 'ngx-bsl';
import { TranslateService } from '@core';
import { SortBy } from './sort-by.enum';

interface SortByOption {
    key: SortBy;
    label: string
}

@Component({
    selector: 'bsa-offers-overview-sort',
    imports: [
        SelectComponent,
        ListBoxOptionComponent,
    ],
    templateUrl: './sort.component.html',
    styleUrl: './sort.component.scss',
})
export class SortComponent {
    private translateService = inject(TranslateService);

    sortChanged = output<SortBy>();

    protected options: SortByOption[] = [
        {
            key: SortBy.NEWEST,
            label: this.translateService.translate('offer.newest'),
        },
        {
            key: SortBy.HIGHEST_SALARY,
            label: this.translateService.translate('offer.highestSalary'),
        },
        {
            key: SortBy.LOWEST_SALARY,
            label: this.translateService.translate('offer.lowestSalary'),
        },
    ];
    protected sortBy = signal(this.options[0]);

    protected onSortByChange(): void {
        this.sortChanged.emit(this.sortBy().key);
    }
}
