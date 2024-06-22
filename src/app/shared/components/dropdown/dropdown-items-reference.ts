import { ElementRef, QueryList } from '@angular/core';

export interface DropdownItemsReference {
    dropdownItems: QueryList<ElementRef<HTMLElement>>
}
