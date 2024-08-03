import {
    Component, EventEmitter, Input, Output, ViewChild,
} from '@angular/core';
import {
    OfferSearchSuggestionsGroup,
} from '@app/features/offers-overview/offer-search/offer-search-suggestions/model/offer-search-suggestion-group.model';
import { DropdownGroupComponent } from '@app/shared/components/dropdown/dropdown-group/dropdown-group.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { DropdownItemComponent } from '@app/shared/components/dropdown/dropdown-item/dropdown-item.component';
import {
    DropdownSeparatorComponent,
} from '@app/shared/components/dropdown/dropdown-separator/dropdown-separator.component';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';

@Component({
    selector: 'bsa-offer-search-suggestions',
    standalone: true,
    imports: [
        DropdownGroupComponent,
        DropdownItemComponent,
        DropdownSeparatorComponent,
        DropdownComponent,
    ],
    templateUrl: './offer-search-suggestions.component.html',
    styleUrl: './offer-search-suggestions.component.scss',
})
export class OfferSearchSuggestionsComponent {
    @Input() suggestions: OfferSearchSuggestionsGroup[] = [];

    @Output() selectSuggestion = new EventEmitter<DropdownItem<string>>();

    @ViewChild(DropdownComponent) dropdownRef!: DropdownComponent;

    onSelectItem(item: DropdownItem<string>): void {
        this.selectSuggestion.emit(item);
    }

    focusFirstElement(): void {
        this.dropdownRef.focusFirstElement();
    }
}
