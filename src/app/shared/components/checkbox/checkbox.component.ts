import { Component, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IconComponent } from '@shared';

@Component({
    selector: 'bsa-checkbox',
    standalone: true,
    imports: [
        IconComponent,
    ],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: CheckboxComponent,
        },
    ],
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() id: string | undefined;

    selected = false;

    onChange = (value: boolean) => {};
    onTouch = () => {};

    @HostListener('click')
    @HostListener('keydown.enter')
    @HostListener('keydown.space')
    onSelect(): void {
        this.selected = !this.selected;
    }

    registerOnChange(onChange: (value: boolean) => void): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouch: () => void): void {
        this.onTouch = onTouch;
    }

    writeValue(value: boolean): void {
        this.selected = value;
    }
}
