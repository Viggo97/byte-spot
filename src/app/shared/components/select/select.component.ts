import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DropdownItem } from '@app/shared/components/dropdown/dropdown-item.model';
import { DropdownItemComponent } from '@app/shared/components/dropdown/dropdown-item/dropdown-item.component';

@Component({
    selector: 'bsa-select',
    standalone: true,
    imports: [
        CdkConnectedOverlay,
        CdkOverlayOrigin,
        DropdownComponent,
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

    value: T | null = null;
    open = false;

    protected onSelectItem(option: DropdownItem<T>): void {
        this.open = false;
        this.value = option.value;
    }
}
