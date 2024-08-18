import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

import { IconComponent } from '@app/shared/components/icon/icon.component';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { DropdownOptionComponent } from '@app/shared/components/dropdown/dropdown-option/dropdown-option.component';
import { SelectValueConverterPipe } from '@app/shared/components/select/select-value-converter.pipe';

@Component({
    selector: 'bsa-select',
    standalone: true,
    imports: [
        CdkConnectedOverlay,
        CdkOverlayOrigin,
        IconComponent,
        DropdownComponent,
        DropdownOptionComponent,
        SelectValueConverterPipe,
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: SelectComponent,
        },
    ],
})
export class SelectComponent<T> implements AfterViewInit, ControlValueAccessor {
    @Input({ required: true }) options!: T[];
    @Input() optionLabel: string | undefined;

    @ViewChild('selectButton') selectButton!: ElementRef<HTMLButtonElement>;
    @ViewChild(DropdownComponent) dropdown!: DropdownComponent;

    value: T | null = null;
    open = false;

    onChange = (value: T) => {};
    onTouch = () => {};

    constructor(private cdr: ChangeDetectorRef) {}

    ngAfterViewInit(): void {
        // Additional change detection is need to provide relevant value for cdkConnectedOverlayWidth
        this.cdr.detectChanges();
    }

    protected onSelectOption(value: T): void {
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
