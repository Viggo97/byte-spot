import { Component, input, ChangeDetectionStrategy, HostListener, forwardRef, contentChildren, ElementRef, output, AfterContentInit, signal, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionIdGenerator } from './option-id-generator';
import { ListBoxOptionComponent } from './list-box-option/list-box-option.component';

@Component({
    selector: 'ngx-bsa-list-box',
    imports: [],
    template: '<ng-content></ng-content>',
    styleUrl: './list-box.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        OptionIdGenerator,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ListBoxComponent),
            multi: true,
        },
    ],
    host: {
        'role': 'listbox',
        '[attr.id]': 'id()',
        '[attr.aria-label]': 'ariaLabel()',
        '[attr.aria-labelledby]': 'ariaLabelledby()',
        '[attr.aria-activedescendant]': 'exposeAriaActiveDescendant() ? null : ariaActiveDescendant()',
        '(blur)': 'clearVisualFocus()',
    },
})
export class ListBoxComponent<TOption> implements OnInit, AfterContentInit, ControlValueAccessor {
    id = input.required<string>();
    ariaLabel = input<string>();
    ariaLabelledby = input<string>();
    exposeAriaActiveDescendant = input(false);
    comparisonField = input<keyof TOption>();
    initialValue = input<TOption | null>();
    initialFocusedOptionIndex  = input<number | null>(null);

    selectOption = output<TOption>();

    listBoxOptions = contentChildren(ListBoxOptionComponent<TOption>);
    listBoxOptionRefs = contentChildren<ListBoxOptionComponent<TOption>, ElementRef<HTMLElement>>
    (ListBoxOptionComponent, { descendants: true, read: ElementRef<HTMLElement> });

    ariaActiveDescendant = signal<string | null>(null);
    onChange = (_value: TOption) => {};
    onTouch = () => {};
    private value: TOption | null = null;

    ngOnInit(): void {
        const initialValue = this.initialValue();
        if (initialValue) {
            this.value = initialValue;
        }
    }

    ngAfterContentInit(): void {
        this.initSelectedOption();
        this.listenForListBoxSelectOption();
    }

    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        if (event.code === 'Enter' || event.code === 'Space') {
            event.preventDefault();
            this.handleSelectionKeys();
            return;
        }

        if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
            event.preventDefault();
            this.handleArrowKeys(event);
            return;
        }
    }

    private initSelectedOption(): void {
        const optionIndex = this.listBoxOptions().findIndex(o => this.equalsToCurrentValue(o.value()));
        if (optionIndex !== -1) {
            this.setSelectedAttribute(optionIndex);
            this.setVisualFocus(optionIndex);
            return;
        }

        if (this.initialFocusedOptionIndex() !== null) {
            this.setVisualFocus(this.initialFocusedOptionIndex() as number);
        }
    }

    private listenForListBoxSelectOption(): void {
        this.listBoxOptions().forEach(option => {
            option.selectOption.subscribe(value => {
                this.removeSelectedAttribute();
                this.clearVisualFocus();
                this.value = value;
                const optionIndex = this.listBoxOptions().findIndex(o => this.equalsToCurrentValue(o.value()));
                if (optionIndex !== -1) {
                    this.setSelectedAttribute(optionIndex);
                    this.setVisualFocus(optionIndex);
                }
                this.onChange(this.value);
                this.selectOption.emit(this.value);
            });
        });
    }

    private equalsToCurrentValue(value: TOption): boolean {
        const comparisonField = this.comparisonField();

        return comparisonField && this.value && typeof this.value === 'object' && comparisonField in this.value
            ? this.value[comparisonField] === value[comparisonField]
            : this.value === value;
    }

    private handleSelectionKeys(): void {
        const optionIndex = this.getVisuallyFocusedListBoxOptionRefIndex();

        if (optionIndex !== -1) {
            this.removeSelectedAttribute();
            this.setSelectedAttribute(optionIndex);
            this.value = this.listBoxOptions()[optionIndex].value();
            this.onChange(this.value);
            this.selectOption.emit(this.value);
        }
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        const optionIndex = this.getVisuallyFocusedListBoxOptionRefIndex();
        const firstOption = 0;
        const lastOption = this.listBoxOptionRefs().length - 1;

        if (optionIndex === -1) {
            if (event.code === 'ArrowDown') {
                this.setVisualFocus(firstOption);
            } else if (event.code === 'ArrowUp') {
                this.setVisualFocus(lastOption);
            }
            return;
        }

        this.removeVisualFocus(optionIndex);

        if (event.code === 'ArrowDown') {
            if (optionIndex === lastOption) {
                this.setVisualFocus(firstOption);
            } else {
                this.setVisualFocus(optionIndex + 1);
            }
        } else if (event.code === 'ArrowUp') {
            if (optionIndex === 0) {
                this.setVisualFocus(lastOption);
            } else {
                this.setVisualFocus(optionIndex - 1);
            }
        }
    }

    private getVisuallyFocusedListBoxOptionRefIndex(): number {
        return this.listBoxOptionRefs().findIndex(r => r.nativeElement.classList.contains('visual-focus'));
    }

    private setVisualFocus(optionIndex: number): void {
        const option = this.listBoxOptionRefs()[optionIndex];
        option.nativeElement.classList.add('visual-focus');
        this.ariaActiveDescendant.set(option.nativeElement.id);
    }

    private removeVisualFocus(optionIndex: number): void {
        this.listBoxOptionRefs()[optionIndex].nativeElement.classList.remove('visual-focus');
        this.ariaActiveDescendant.set(null);
    }

    protected clearVisualFocus(): void {
        const optionIndex = this.getVisuallyFocusedListBoxOptionRefIndex();
        if (optionIndex !== -1) {
            this.removeVisualFocus(optionIndex);
        }
    }

    protected setSelectedAttribute(optionIndex: number): void {
        this.listBoxOptionRefs()[optionIndex].nativeElement.setAttribute('aria-selected', 'true');
    }

    protected removeSelectedAttribute(): void {
        this.listBoxOptionRefs()
            .find(o => o.nativeElement.hasAttribute('aria-selected'))
            ?.nativeElement.removeAttribute('aria-selected');
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
