import { Component, inject } from '@angular/core';
import { ListBoxOptionComponent, SelectComponent } from 'ngx-bsl';
import { TranslatePipe } from '@core';
import { SortService } from './sort.service';

@Component({
    selector: 'bsa-offers-overview-sort',
    imports: [
        SelectComponent,
        ListBoxOptionComponent,
        TranslatePipe,
    ],
    templateUrl: './sort.component.html',
    styleUrl: './sort.component.scss',
})
export class SortComponent {
    private sortService = inject(SortService);

    protected options = this.sortService.options;
    protected sortBy = this.sortService.sortBy;

    protected onSortByChange(): void {
        this.sortService.changeSort();
    }
}
