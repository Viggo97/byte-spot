import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@core';
import { SearchFormComponent } from '../form/search-form.component';
import { SearchService } from '../search.service';

@Component({
    selector: 'bsa-offers-overview-search-view-broad',
    imports: [
        TranslatePipe,
        SearchFormComponent,
    ],
    templateUrl: './search-view-broad.component.html',
    styleUrl: './search-view-broad.component.scss',
})
export class SearchViewBroadComponent {
    private searchService = inject(SearchService);

    protected onConfirmSelection(): void {
        this.searchService.changeSearch();
    }
}

