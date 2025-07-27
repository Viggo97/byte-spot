import { Component, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'bsa-checkbox',
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

    checked = false;
    disabled = false;


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange = (_value: boolean) => {};
    onTouch = () => {};

    @HostListener('click')
    @HostListener('keyup.enter')
    @HostListener('keyup.space')
    onSelect(): void {
        if (this.disabled) {
            return;
        }

        this.checked = !this.checked;
        this.onChange(this.checked);
    }

    @HostListener('keydown.enter', ['$event'])
    @HostListener('keydown.space', ['$event'])
    onKeydown(event?: KeyboardEvent): void {
        event?.preventDefault();
    }

    registerOnChange(onChange: (value: boolean) => void): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouch: () => void): void {
        this.onTouch = onTouch;
    }

    writeValue(value: boolean): void {
        this.checked = value;
    }

    setDisabledState(disabled: boolean): void {
        this.disabled = disabled;
    }
}
