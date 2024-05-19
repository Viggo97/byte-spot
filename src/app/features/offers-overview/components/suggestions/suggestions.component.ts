import { Component, Input } from '@angular/core';
import { SuggestionsGroup } from '@app/features/offers-overview/model/suggestions-group.model';
import { DropdownGroupComponent } from '@app/shared/components/dropdown/dropdown-group/dropdown-group.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { DropdownItemComponent } from '@app/shared/components/dropdown/dropdown-item/dropdown-item.component';
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
export class SuggestionsComponent {
    @Input() suggestions: SuggestionsGroup[] = [];

    onSelectItem(item: DropdownItem): void {
    }
}
