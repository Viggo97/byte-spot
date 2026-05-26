import { ChangeDetectionStrategy, Component, input, model, ViewEncapsulation } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
    selector: 'bsl-checkbox-button',
    imports: [],
    templateUrl: './checkbox-button.component.html',
    styleUrl: './checkbox-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class CheckboxButtonComponent implements FormCheckboxControl {
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
