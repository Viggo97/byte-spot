import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { DropdownItemComponent } from '@app/shared/components/dropdown/dropdown-item/dropdown-item.component';
import { DropdownContainerComponent } from '@app/shared/components/dropdown-container/dropdown-container.component';

@Component({
    selector: 'bsa-select',
    standalone: true,
    imports: [
        CdkConnectedOverlay,
        CdkOverlayOrigin,
        DropdownComponent,
        DropdownContainerComponent,
        DropdownItemComponent,
        FormsModule,
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
})
export class SelectComponent<T> {
    @Input({ required: true }) options!: DropdownItem<T>[];
    @Input() numberOfVisibleOptions?: number;

    @Output() selectOption = new EventEmitter<DropdownItem<T>>();

    value: unknown = null;
    open = false;

    protected onSelectItem(option: DropdownItem<T>): void {
        this.open = false;
        this.value = option.value;
    }
}
