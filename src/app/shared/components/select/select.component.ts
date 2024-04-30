import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
    Component, ElementRef, Input, ViewChild,
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
    value: string = '10';

    @Input({ required: true }) options!: Map<string, string>;

    @ViewChild('buttonTrigger') input!: ElementRef<HTMLInputElement>;

    protected open = false;

    constructor(private elementRef: ElementRef) {
    }

    protected onSelectOption(option: DropdownOption): void {
        this.open = false;
        this.value = option.value;
    }

    protected onOutsideClick(event: MouseEvent): void {
        if (this.elementRef.nativeElement.contains(event.target)) {
            event.stopPropagation();
        }

        this.open = false;
    }
}
