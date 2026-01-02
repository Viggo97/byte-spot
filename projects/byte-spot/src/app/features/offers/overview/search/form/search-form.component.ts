import { Component, inject, output, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComboboxComponent, ListBoxGroupComponent, ListBoxOptionComponent, ListBoxSeparatorComponent } from 'ngx-bsl';
import { TranslatePipe } from '@core';
import { SearchService } from '../search.service';
import { CategorySearchOptions } from '../models/category-search-options.interface';
import { SearchOption } from '../models/search-option.interface';

@Component({
    selector: 'bsa-offers-overview-search-form',
    imports: [
        ReactiveFormsModule,
        ComboboxComponent,
        ListBoxGroupComponent,
        ListBoxOptionComponent,
        ListBoxSeparatorComponent,
        TranslatePipe,
    ],
    templateUrl: './search-form.component.html',
})
export class SearchFormComponent {
    private searchService = inject(SearchService);

    confirmSelection = output();

    protected form = this.searchService.searchForm;
    protected categories: Signal<CategorySearchOptions[]> = toSignal(this.searchService.options$, {initialValue: []});
    protected optionValueParse = (option: SearchOption) => option.value;

    protected onConfirmSelection(): void {
        this.confirmSelection.emit();
    }
}
