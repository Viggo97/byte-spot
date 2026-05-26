import {ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    input,
    output,
    signal,
    ViewEncapsulation,
    OnInit,
    effect,
    DestroyRef,
    model} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CdkConnectedOverlay, CdkOverlayOrigin} from '@angular/cdk/overlay';
import {ListBoxDirective} from '../list-box/list-box.directive';

@Component({
    selector: 'bsl-combobox',
    imports: [
        CdkOverlayOrigin,
        CdkConnectedOverlay,
    ],
    templateUrl: './combobox.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [
        {
            directive: ListBoxDirective,
            inputs: ['listBoxId', 'listBoxAriaLabel', 'listBoxAriaLabelledby', 'optionValueEquality'],
        },
    ],
})
export class ComboboxComponent<TOption> implements FormValueControl<string>, OnInit {
    protected listBox = inject(ListBoxDirective<TOption>);
    private destroyRef = inject(DestroyRef);

    id = input.required<string>();
    placeholder = input<string>('');
    ariaLabel = input<string>();
    ariaLabelledBy = input<string>();
    optionValueParse = input<(option: TOption) => string>((option) => option as string);

    confirmSelection = output();

    value = model<string>('');

    protected open = signal(false);
    protected ariaActiveDescendant = computed<string | null>(() => this.listBox.ariaActiveDescendant() ?? null);
    private optionSelecting = false;
    private optionChangedBy: 'selection' | 'input' | null = null;

    constructor() {
        effect(() => {
            const hasOptions = this.listBox.listBoxOptions().length;
            if (this.optionChangedBy === 'input' && hasOptions) {
                this.showListBox();
                // Must be set after option components initialization.
                setTimeout(() => this.listBox.setVisualMarkups(this.value()));
            } else if (this.optionChangedBy === 'selection' || !hasOptions) {
                this.hideListBox();
            }
            this.optionChangedBy = null;
        });
    }

    ngOnInit(): void {
        this.listBox.hasAriaSelected = false;
        this.subscribeSelectOption();
    }

    private subscribeSelectOption(): void {
        this.listBox.selectOption.pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(option => {
            if (option) {
                this.optionChangedBy = 'selection';
                this.value.set(this.optionValueParse()(option));
            }
            this.hideListBox();
        });
    }

    protected showListBox(): void {
        if (this.open()) return;
        this.open.set(true);
    }

    protected hideListBox(): void {
        if (!this.open()) return;
        this.open.set(false);
    }

    protected onClick(): void {
        if (this.open()) {
            this.hideListBox();
        } else {
            if (this.listBox.listBoxOptions().length) {
                this.showListBox();
                this.listBox.setVisualMarkups(this.value());
            }
        }
    }

    protected onBlur(): void {
        if (!this.optionSelecting) {
            this.hideListBox();
        }
    }

    protected onListBoxPointerDown(event: PointerEvent): void {
        event.preventDefault();
        this.optionSelecting = true;
    }

    protected onListBoxClick(event: MouseEvent): void {
        this.listBox.onClick(event);
        this.optionSelecting = false;
    }

    protected onInputChange(event: InputEvent): void {
        const value = (event.target as HTMLInputElement).value;
        this.value.set(value);
        this.optionChangedBy = 'input';
        if (this.listBox.listBoxOptions().length) {
            this.showListBox();
            this.listBox.setVisualMarkups(this.value());

        }
    }

    protected onKeydown(event: KeyboardEvent): void {
        event.preventDefault();

        if (this.open()) {
            this.listBox.onKeydown(event);
        } else if (event.code === 'Enter') {
            this.confirmSelection.emit();
        } else {
            if (!this.listBox.listBoxOptions().length) {
                return;
            }
            this.showListBox();
            const markupsSet = this.listBox.setVisualMarkups(this.value());
            if (!markupsSet) {
                this.listBox.onKeydown(event);
            }
        }
    }
}
