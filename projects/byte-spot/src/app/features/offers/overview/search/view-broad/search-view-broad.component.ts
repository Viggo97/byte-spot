import { Component, output } from '@angular/core';
import { TranslatePipe } from '@core';
import { SearchFormComponent } from '../form/search-form.component';

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
    confirmSelection = output();

    protected onConfirmSelection(): void {
        this.confirmSelection.emit();
    }
}

