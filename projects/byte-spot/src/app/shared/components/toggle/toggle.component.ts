import { Component, HostBinding, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'bsa-toggle',
    standalone: true,
    imports: [],
    template: '<ng-content></ng-content>',
    styleUrl: './toggle.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ToggleComponent,
        },
    ],
})
export class ToggleComponent implements ControlValueAccessor {
    @HostBinding('tabindex') get tabindex() { return this.disabled ? -1 : 0; }
    @HostBinding('class.checked') checked = false;
    @HostBinding('class.disabled') disabled = false;

    onChange = (value: boolean) => {};
    onTouch = () => {};

    @HostListener('click')
    @HostListener('keyup.enter')
    @HostListener('keyup.space')
    onCheck(): void {
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
