import { Component, HostListener, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconCheckComponent } from 'projects/byte-spot-lib/src/lib/components/icons/icon-check.component';

@Component({
    selector: 'ngx-bsa-checkbox',
    imports: [
        IconCheckComponent,
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
    id = input.required<string>();

    protected checked = signal(false);
    protected disabled = signal(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange = (_value: boolean) => {};
    onTouch = () => {};

    registerOnChange(onChange: (value: boolean) => void): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouch: () => void): void {
        this.onTouch = onTouch;
    }

    writeValue(value: boolean): void {
        this.checked.set(value);
    }

    setDisabledState(disabled: boolean): void {
        this.disabled.set(disabled);
    }

    @HostListener('keydown.enter', ['$event'])
    @HostListener('keydown.space', ['$event'])
    onKeydown(event?: KeyboardEvent): void {
        event?.preventDefault();
    }

    @HostListener('click')
    @HostListener('keyup.enter')
    @HostListener('keyup.space')
    onSelect(): void {
        if (this.disabled()) {
            return;
        }

        this.checked.set(!this.checked());
        this.onChange(this.checked());
    }
}
