import { Component, inject, output, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComboboxComponent, ListBoxGroupComponent, ListBoxOptionComponent, ListBoxSeparatorComponent } from 'ngx-bsl';
import { TranslatePipe } from '@core';
import { SearchService } from '../search.service';
import { Suggestion } from '../models/suggestion.interface';
import { SuggestionCategoryGroup } from '../models/suggestion-category-group.interface';
import { suggestionCategoryLangMap } from '../models/suggestion-category-lang-map.const';

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

    suggestionCategoryLangMap = suggestionCategoryLangMap;

    protected form = this.searchService.searchForm;
    protected categories: Signal<SuggestionCategoryGroup[]>
        = toSignal(this.searchService.options$, {initialValue: []});
    protected optionValueParse = (option: Suggestion) => option.value;

    protected onConfirmSelection(): void {
        this.confirmSelection.emit();
    }
}
