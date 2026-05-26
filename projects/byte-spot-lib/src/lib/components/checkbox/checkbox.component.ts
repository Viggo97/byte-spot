import { ChangeDetectionStrategy, Component, input, model, ViewEncapsulation } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
    selector: 'bsl-checkbox',
    imports: [],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '(keydown.enter)': 'onKeydown($event)',
        '(keydown.space)': 'onKeydown($event)',
        '(click)': 'onSelect()',
        '(keyup.enter)': 'onSelect()',
        '(keyup.space)': 'onSelect()',
    },
})
export class CheckboxComponent implements FormCheckboxControl {
    id = input.required<string>();
    disabled = input(false);
    checked = model(false);

    onKeydown(event: Event): void {
        event.preventDefault();
    }

    onSelect(): void {
        if (this.disabled()) {
            return;
        }

        this.checked.set(!this.checked());
    }
}
