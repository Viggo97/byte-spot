import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { DropdownComponent, DropdownGroupComponent, DropdownOptionComponent, DropdownSeparatorComponent } from '@shared';
import { OfferSearchSuggestionsGroup } from './model/offer-search-suggestion-group.model';

@Component({
    selector: 'bsa-offer-search-suggestions',
    standalone: true,
    imports: [
        DropdownComponent,
        DropdownGroupComponent,
        DropdownOptionComponent,
        DropdownSeparatorComponent,
    ],
    templateUrl: './offer-search-suggestions.component.html',
    styleUrl: './offer-search-suggestions.component.scss',
})
export class OfferSearchSuggestionsComponent {
    @Input() suggestions: OfferSearchSuggestionsGroup[] = [];

    @Output() selectSuggestion = new EventEmitter<string>();

    @ViewChild(DropdownComponent) dropdownRef!: DropdownComponent;

    onSelectOption(item: string): void {
        this.selectSuggestion.emit(item);
    }

    focusFirstElement(): void {
        this.dropdownRef.focusFirstElement();
    }
}
