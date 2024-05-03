import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
    Component, Input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownContainerComponent } from '@app/shared/components/dropdown-container/dropdown-container.component';
import { DropdownOption } from '@app/shared/models/dropdown-container/dropdown-option';

@Component({
    selector: 'bsa-select',
    standalone: true,
    imports: [
        FormsModule,
        CdkOverlayOrigin,
        DropdownContainerComponent,
        CdkConnectedOverlay,
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
})
export class SelectComponent {
    @Input({ required: true }) options!: Map<string, string>;

    @Input() numberOfVisibleOptions?: number;

    protected value: string | null = '';

    protected open = false;

    protected onSelectOption(option: DropdownOption): void {
        this.open = false;
        this.value = option.value;
    }
}
