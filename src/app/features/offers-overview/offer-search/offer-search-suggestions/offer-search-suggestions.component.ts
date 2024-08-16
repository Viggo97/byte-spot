import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { OfferSearchSuggestionsGroup } from '@app/features/offers-overview/offer-search/offer-search-suggestions/model/offer-search-suggestion-group.model';
import { DropdownGroupComponent } from '@app/shared/components/dropdown/dropdown-group/dropdown-group.component';
import { DropdownOptionComponent } from '@app/shared/components/dropdown/dropdown-option/dropdown-option.component';
import { DropdownSeparatorComponent } from '@app/shared/components/dropdown/dropdown-separator/dropdown-separator.component';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';

@Component({
    selector: 'bsa-offer-search-suggestions',
    standalone: true,
    imports: [
        DropdownGroupComponent,
        DropdownOptionComponent,
        DropdownSeparatorComponent,
        DropdownComponent,
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
