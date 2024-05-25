import {
    Component, ElementRef, Input, QueryList, ViewChildren,
} from '@angular/core';
import { SuggestionsGroup } from '@app/features/offers-overview/model/suggestions-group.model';
import { DropdownGroupComponent } from '@app/shared/components/dropdown/dropdown-group/dropdown-group.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { DropdownItemComponent } from '@app/shared/components/dropdown/dropdown-item/dropdown-item.component';
import { DropdownItemsReference } from '@app/shared/components/dropdown/dropdown-items-reference';
import {
    DropdownSeparatorComponent,
} from '@app/shared/components/dropdown/dropdown-separator/dropdown-separator.component';

@Component({
    selector: 'bsa-suggestions',
    standalone: true,
    imports: [
        DropdownGroupComponent,
        DropdownItemComponent,
        DropdownSeparatorComponent,
    ],
    templateUrl: './suggestions.component.html',
    styleUrl: './suggestions.component.scss',
})
export class SuggestionsComponent implements DropdownItemsReference {
    @Input() suggestions: SuggestionsGroup[] = [];

    @ViewChildren(DropdownItemComponent, { read: ElementRef })
        dropdownItems!: QueryList<ElementRef<DropdownItemComponent>>;

    onSelectItem(item: DropdownItem): void {
    }
}
