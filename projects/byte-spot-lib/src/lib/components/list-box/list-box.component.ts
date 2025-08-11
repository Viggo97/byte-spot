import { Component, input, ChangeDetectionStrategy, HostListener, forwardRef, contentChildren, ElementRef, output, AfterContentInit, signal } from '@angular/core';
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
export class ListBoxComponent<T> implements ControlValueAccessor, AfterContentInit {
    id = input.required<string>();
    ariaLabel = input<string>();
    ariaLabelledby = input<string>();
    exposeAriaActiveDescendant = input(false);
    comparisonField = input<keyof T>();

    selectOption = output<T>();

    listBoxOptions = contentChildren(ListBoxOptionComponent<T>);
    listBoxOptionRefs = contentChildren<ListBoxOptionComponent<T>, ElementRef<HTMLElement>>
    (ListBoxOptionComponent, { descendants: true, read: ElementRef<HTMLElement> });

    ariaActiveDescendant = signal<string | null>(null);
    onChange = (_value: T) => {};
    onTouch = () => {};
    value?: T;

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
            this.addSelectedAttribute(optionIndex);
            this.addVisualFocus(optionIndex);
        }
    }

    private listenForListBoxSelectOption(): void {
        this.listBoxOptions().forEach(option => {
            option.selectOption.subscribe(value => {
                this.removeSelectedAttribute();
                this.clearVisualFocus();
                const optionIndex = this.listBoxOptions().findIndex(o => this.equalsToCurrentValue(o.value()));
                if (optionIndex !== -1) {
                    this.addSelectedAttribute(optionIndex);
                    this.addVisualFocus(optionIndex);
                }
                this.value = value;
                this.onChange(this.value);
            });
        });
    }

    private equalsToCurrentValue(value: T): boolean {
        const comparisonField = this.comparisonField();

        return comparisonField && this.value && typeof this.value === 'object' && comparisonField in this.value
            ? this.value[comparisonField] === value[comparisonField]
            : this.value === value;
    }

    private handleSelectionKeys(): void {
        const optionIndex = this.getVisuallyFocusedListBoxOptionRefIndex();

        if (optionIndex !== -1) {
            this.removeSelectedAttribute();
            this.addSelectedAttribute(optionIndex);
            this.value = this.listBoxOptions()[optionIndex].value();
            this.onChange(this.value);
        } else {
            this.addVisualFocus(0);
        }
    }

    private handleArrowKeys(event: KeyboardEvent): void {
        const optionIndex = this.getVisuallyFocusedListBoxOptionRefIndex();
        const firstOption = 0;
        const lastOption = this.listBoxOptionRefs().length - 1;

        if (optionIndex === -1) {
            if (event.code === 'ArrowDown') {
                this.addVisualFocus(firstOption);
            } else if (event.code === 'ArrowUp') {
                this.addVisualFocus(lastOption);
            }
            return;
        }

        this.removeVisualFocus(optionIndex);

        if (event.code === 'ArrowDown') {
            if (optionIndex === lastOption) {
                this.addVisualFocus(firstOption);
            } else {
                this.addVisualFocus(optionIndex + 1);
            }
        } else if (event.code === 'ArrowUp') {
            if (optionIndex === 0) {
                this.addVisualFocus(lastOption);
            } else {
                this.addVisualFocus(optionIndex - 1);
            }
        }
    }

    private getVisuallyFocusedListBoxOptionRefIndex(): number {
        return this.listBoxOptionRefs().findIndex(r => r.nativeElement.classList.contains('visual-focus'));
    }

    private addVisualFocus(optionIndex: number): void {
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

    protected addSelectedAttribute(optionIndex: number): void {
        this.listBoxOptionRefs()[optionIndex].nativeElement.setAttribute('aria-selected', 'true');
    }

    protected removeSelectedAttribute(): void {
        this.listBoxOptionRefs()
            .find(o => o.nativeElement.hasAttribute('aria-selected'))
            ?.nativeElement.removeAttribute('aria-selected');
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
