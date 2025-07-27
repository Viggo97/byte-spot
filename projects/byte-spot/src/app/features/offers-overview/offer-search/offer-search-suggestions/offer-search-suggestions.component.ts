import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslatePipe } from '@core';

import { DropdownComponent, DropdownGroupComponent, DropdownOptionComponent, DropdownSeparatorComponent } from '@shared';
import { OfferSearchSuggestions } from '../offer-search-suggestions.interface';

@Component({
    selector: 'bsa-offer-search-suggestions',
    imports: [
        DropdownComponent,
        DropdownGroupComponent,
        DropdownOptionComponent,
        DropdownSeparatorComponent,
        TranslatePipe,
    ],
    templateUrl: './offer-search-suggestions.component.html',
    styleUrl: './offer-search-suggestions.component.scss',
})
export class OfferSearchSuggestionsComponent {
    @Input() suggestions: OfferSearchSuggestions[] = [];

    @Output() selectSuggestion = new EventEmitter<string>();

    @ViewChild(DropdownComponent) dropdownRef!: DropdownComponent;

    onSelectOption(item: string): void {
        this.selectSuggestion.emit(item);
    }

    focusFirstElement(): void {
        this.dropdownRef.focusFirstElement();
    }
}
