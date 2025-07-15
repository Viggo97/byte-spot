import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

import { IconComponent } from '../icon/icon.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { DropdownOptionComponent } from '../dropdown/dropdown-option/dropdown-option.component';
import { SelectValueConverterPipe } from '../../pipes/select-value-converter.pipe';

@Component({
    selector: 'bsa-select-button',
    imports: [
        CdkOverlayOrigin,
        IconComponent,
        CdkConnectedOverlay,
        DropdownComponent,
        DropdownOptionComponent,
        SelectValueConverterPipe,
    ],
    templateUrl: './select-button.component.html',
    styles: '',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: SelectButtonComponent,
        },
    ]
})
export class SelectButtonComponent<T> implements ControlValueAccessor {
    @Input({ required: true }) icon!: string;
    @Input() buttonSize = '2rem';
    @Input({ required: true }) options!: T[];
    @Input() optionLabel: string | undefined;
    @Input() dropdownWidth = '8rem';

    @ViewChild('selectButton') selectButton!: ElementRef<HTMLButtonElement>;
    @ViewChild(DropdownComponent) dropdown!: DropdownComponent;

    value: T | null = null;
    open = false;

    onChange = (value: T) => {};
    onTouch = () => {};

    constructor(private cdr: ChangeDetectorRef) {
    }

    onSelectOption(value: T): void {
        this.open = false;
        this.value = value;
        this.onChange(this.value);
    }

    moveFocusToDropdown(): void {
        if (this.open) {
            this.cdr.detectChanges();
            this.dropdown.focusFirstElement();
        }
    }

    restoreFocusToButton(): void {
        this.selectButton.nativeElement.focus();
    }

    registerOnChange(onChange: (value: T) => void): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouch: () => void): void {
        this.onTouch = onTouch;
    }

    writeValue(value: T): void {
        this.value = value;
    }
}
