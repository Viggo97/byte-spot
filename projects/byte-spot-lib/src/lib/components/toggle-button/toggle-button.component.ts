import { Component, computed, HostListener, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ngx-bsa-toggle-button',
    imports: [],
    template: '<ng-content></ng-content>',
    styleUrl: './toggle-button.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ToggleButtonComponent,
        },
    ],
    host: {
        '[tabindex]': 'tabIndex()',
        '[class.checked]': 'checked()',
        '[class.disabled]': 'disabled()',
    },
})
export class ToggleButtonComponent implements ControlValueAccessor {
    checked = signal(false);
    disabled = signal(false);
    tabIndex = computed(() => this.disabled() ? -1 : 0);

    onChange = (_value: boolean) => {};
    onTouch = () => {};

    @HostListener('click')
    @HostListener('keyup.enter')
    @HostListener('keyup.space')
    onCheck(): void {
        if (this.disabled()) {
            return;
        }

        this.checked.update(value => !value);
        this.onChange(this.checked());
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
        this.checked.set(value);
    }

    setDisabledState(disabled: boolean): void {
        this.disabled.set(disabled);
    }
}
