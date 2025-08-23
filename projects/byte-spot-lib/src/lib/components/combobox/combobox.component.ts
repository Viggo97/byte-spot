import { Component, computed, forwardRef, input, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ListBoxComponent } from '../list-box/list-box.component';
import { ListBoxOptionComponent } from '../list-box/list-box-option/list-box-option.component';
import { ListBoxOptionValueConverterPipe } from '../list-box/list-box-option/list-box-option-value-converter.pipe';

@Component({
    selector: 'ngx-bsa-combobox',
    imports: [
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        ListBoxComponent,
        ListBoxOptionComponent,
        ListBoxOptionValueConverterPipe,
    ],
    templateUrl: './combobox.component.html',
    styleUrl: './combobox.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ComboboxComponent),
            multi: true,
        },
    ],
})
export class ComboboxComponent<TOption> implements ControlValueAccessor {
    id = input.required<string>();
    options = input.required<TOption[]>();
    bindLabel = input<string>();
    placeholder = input<string>('');
    ariaLabel = input<string>();
    ariaLabelledBy = input<string>();
    comparisonField = input<keyof TOption>();

    confirmSelection = output();

    private listBox = viewChild(ListBoxComponent);

    onChange = (_value: TOption) => {};
    onTouch = () => {};
    protected value: TOption | null = null;

    protected open = signal(false);
    protected ariaActiveDescendant = computed<string | null>(() => this.listBox()?.ariaActiveDescendant() ?? null);
    protected initialFocusedOptionIndex = signal(0);

    protected showListBox(): void {
        this.open.set(true);
    }

    protected hideListBox(): void {
        this.open.set(false);
    }

    protected onClick(): void {
        if (this.open()) {
            this.hideListBox();
        } else {
            this.showListBox();
        }
    }

    protected onSelectOption(value: TOption): void {
        this.value = value;
        this.onChange(this.value);
        this.hideListBox();
    }

    protected onInputChange(event: InputEvent) {
        const value = (event.target as HTMLInputElement).value as TOption;

        if (!this.open()) {
            this.showListBox();
        }

        this.value = value;
        this.onChange(this.value);
    }

    protected onKeydown(event: KeyboardEvent) {
        event.preventDefault();

        if (!this.open()) {
            if (event.code === 'ArrowUp') {
                this.initialFocusedOptionIndex.set(this.options().length - 1);
                this.showListBox();
            } else if (event.code === 'ArrowDown') {
                this.initialFocusedOptionIndex.set(0);
                this.showListBox();
            } else if (event.code === 'Enter') {
                this.confirmSelection.emit();
            }
        } else {
            this.listBox()?.onKeydown(event);
        }
    }

    registerOnChange(onChange: (value: TOption) => void): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouch: () => void): void {
        this.onTouch = onTouch;
    }

    writeValue(value: TOption): void {
        this.value = value;
    }
}
