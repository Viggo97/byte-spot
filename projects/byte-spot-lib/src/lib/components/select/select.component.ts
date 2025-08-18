import { Component, inject, input, signal, viewChild, OnInit, forwardRef, DestroyRef, computed } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { IconChevronDownComponent } from '../icons/icon-chevron-down.component';
import { ListBoxComponent } from '../list-box/list-box.component';
import { ListBoxOptionComponent } from '../list-box/list-box-option/list-box-option.component';
import { ListBoxOptionValueConverterPipe } from '../list-box/list-box-option/list-box-option-value-converter.pipe';
import { ListBoxEventMiddlewareDirective } from '../list-box/list-box-event-middleware.directive';
import { ListBoxEventBusUtil } from '../list-box/list-box-event-bus.util';

@Component({
    selector: 'ngx-bsa-select',
    imports: [
        CdkOverlayOrigin,
        CdkConnectedOverlay,
        FormsModule,
        ReactiveFormsModule,
        IconChevronDownComponent,
        ListBoxComponent,
        ListBoxOptionComponent,
        ListBoxOptionValueConverterPipe,
        ListBoxEventMiddlewareDirective,
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    providers: [
        ListBoxEventBusUtil,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
})
export class SelectComponent<TOption> implements OnInit, ControlValueAccessor {
    id = input.required<string>();
    options = input.required<TOption[]>();
    bindLabel = input<string>();
    placeholder = input<string>('');
    ariaLabel = input<string>();
    ariaLabelledBy = input<string>();
    comparisonField = input<keyof TOption>();
    iconMode = input(false);
    customIcon = input(false);
    dropdownWidth = input<string>();

    private listBox = viewChild(ListBoxComponent);

    private listBoxEventBus = inject(ListBoxEventBusUtil);
    private destroyRef = inject(DestroyRef);

    onChange = (_value: TOption) => {};
    onTouch = () => {};
    value: TOption | null = null;

    protected open = signal(false);
    protected form = new FormControl<TOption | null>(null);
    protected ariaActiveDescendant = computed<string | null>(() => this.listBox()?.ariaActiveDescendant() ?? null);
    protected initialFocusedOptionIndex = signal(0);

    ngOnInit(): void {
        this.form.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
                if (value) {
                    this.value = value;
                    this.onChange(this.value);
                }
                this.hideListBox();
            });
    }

    protected showListBox(): void {
        this. open.set(true);
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

    protected onKeydown(event: KeyboardEvent) {
        event.preventDefault();

        if (!this.open()) {
            this.showListBox();
            if (event.code === 'ArrowUp') {
                this.initialFocusedOptionIndex.set(this.options().length - 1);
            } else if (event.code === 'ArrowDown') {
                this.initialFocusedOptionIndex.set(0);
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
        this.form.setValue(value);
    }
}
