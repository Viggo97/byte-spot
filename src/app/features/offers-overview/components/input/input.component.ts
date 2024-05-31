import { Component, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'bsa-offers-search-input',
    standalone: true,
    imports: [],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: InputComponent,
        },
    ],
})
export class InputComponent implements ControlValueAccessor {
    protected value = '';
    private onChange!: (value: string) => void;

    @ViewChild('input') input!: ElementRef<HTMLInputElement>;

    onChangeInput(phrase: string): void {
        this.onChange(phrase);
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(): void {
    }

    writeValue(value: string): void {
        this.value = value;
    }
}
