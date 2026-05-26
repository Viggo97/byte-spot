import {ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    input,
    model,
    signal,
    ViewEncapsulation, OnInit} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {CdkConnectedOverlay, CdkOverlayOrigin} from '@angular/cdk/overlay';
import {ListBoxDirective} from '../list-box/list-box.directive';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'bsl-select',
    imports: [
        CdkOverlayOrigin,
        CdkConnectedOverlay,
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    hostDirectives: [
        {
            directive: ListBoxDirective,
            inputs: ['listBoxId', 'listBoxAriaLabel', 'listBoxAriaLabelledby', 'optionValueEquality'],
        },
    ],
})
export class SelectComponent<TOption, TValue> implements FormValueControl<TValue | undefined>, OnInit {
    protected listBox = inject(ListBoxDirective<TOption>);
    private destroyRef = inject(DestroyRef);

    id = input.required<string>();
    placeholder = input<string>('');
    ariaLabel = input<string>();
    ariaLabelledBy = input<string>();
    iconMode = input(false);
    customIcon = input(false);
    dropdownWidth = input<string>();
    optionValueParse = input<(option: TOption) => TValue>((option) => option as unknown as TValue);
    displayLabel = input<string>();

    value = model<TValue | undefined>(undefined);

    protected open = signal(false);
    protected ariaActiveDescendant = computed<string | null>(() => this.listBox.ariaActiveDescendant() ?? null);
    protected displayValue = computed(() => {
        const displayLabel = this.displayLabel();
        const value = this.value();

        if (displayLabel && value && typeof value === 'object' && displayLabel in value) {
            return value[displayLabel as keyof TValue];
        } else {
            return value;
        }
    });

    ngOnInit(): void {
        this.listBox.hasAriaSelected = true;
        this.subscribeSelectOption();
    }

    private subscribeSelectOption(): void {
        this.listBox.selectOption.pipe(
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(option => {
            if (option) {
                this.value.set(this.optionValueParse()(option));
                this.hideListBox();
            }
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

    protected onListBoxClick(event: MouseEvent): void {
        this.listBox.onClick(event);
    }

    protected onKeydown(event: KeyboardEvent) {
        event.preventDefault();

        if (this.open()) {
            this.listBox.onKeydown(event);
        } else {
            this.showListBox();
            const markupsSet = this.listBox.setVisualMarkups(this.value());
            if (!markupsSet) {
                this.listBox.onKeydown(event);
            }
        }
    }
}
