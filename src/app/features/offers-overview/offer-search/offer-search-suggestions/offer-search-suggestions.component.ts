import {
    Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren,
} from '@angular/core';
import { OfferSearchSuggestionsGroup } from '@app/features/offers-overview/offer-search/offer-search-suggestions/model/offer-search-suggestion-group.model';
import { DropdownGroupComponent } from '@app/shared/components/dropdown/dropdown-group/dropdown-group.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { DropdownItemComponent } from '@app/shared/components/dropdown/dropdown-item/dropdown-item.component';
import { DropdownItemsReference } from '@app/shared/components/dropdown/dropdown-items-reference';
import {
    DropdownSeparatorComponent,
} from '@app/shared/components/dropdown/dropdown-separator/dropdown-separator.component';

@Component({
    selector: 'bsa-offer-search-suggestions',
    standalone: true,
    imports: [
        DropdownGroupComponent,
        DropdownItemComponent,
        DropdownSeparatorComponent,
    ],
    templateUrl: './offer-search-suggestions.component.html',
    styleUrl: './offer-search-suggestions.component.scss',
})
export class OfferSearchSuggestionsComponent implements DropdownItemsReference {
    @Input() suggestions: OfferSearchSuggestionsGroup[] = [];

    @Output() suggestionSelected = new EventEmitter<DropdownItem<string>>();

    @ViewChildren(DropdownItemComponent, { read: ElementRef })
        dropdownItems!: QueryList<ElementRef<HTMLElement>>;

    onSelectItem(item: DropdownItem<string>): void {
        this.suggestionSelected.emit(item);
    }
}
