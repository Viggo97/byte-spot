import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@core';
import { Subject } from 'rxjs';
import { SortBy } from './sort-by.enum';
import { SortByOption } from './models/sort-by-option.interface';

@Injectable()
export class SortService {
    private translateService = inject(TranslateService);

    private sortChanged = new Subject<void>();
    sortChanged$ = this.sortChanged.asObservable();

    options = signal<SortByOption[]>(
        [
            {
                key: SortBy.LATEST,
                label: this.translateService.translate('offer.latest'),
            },
            {
                key: SortBy.HIGHEST_SALARY,
                label: this.translateService.translate('offer.highestSalary'),
            },
            {
                key: SortBy.LOWEST_SALARY,
                label: this.translateService.translate('offer.lowestSalary'),
            },
        ],
    );

    sortBy = signal(this.options()[0]);

    changeSort(): void {
        this.sortChanged.next();
    }

    getSortValue(): string {
        return this.sortBy().key;
    }
}
