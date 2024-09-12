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
    @HostBinding('tabindex') tabindex = 0;
    @HostBinding('class.checked') checked = false;

    onChange = (value: boolean) => {};
    onTouch = () => {};

    @HostListener('click')
    @HostListener('keyup.enter')
    @HostListener('keyup.space')
    onCheck(): void {
        this.checked = !this.checked;
        this.onChange(this.checked);
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
}
