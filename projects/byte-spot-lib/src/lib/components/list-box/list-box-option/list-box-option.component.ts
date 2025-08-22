import { ChangeDetectionStrategy, Component, computed, HostListener, inject, input, output } from '@angular/core';
import { OptionIdGenerator } from '../option-id-generator';
import { IconCheckComponent } from '../../icons/icon-check.component';

@Component({
    selector: 'ngx-bsa-list-box-option',
    imports: [
        IconCheckComponent,
    ],
    template: `
        <ng-content></ng-content>
        @if (showCheck()) {
            <ngx-bsa-icon-check></ngx-bsa-icon-check>
        }
    `,
    styleUrl: './list-box-option.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        'role': 'option',
        '[attr.id]': 'listBoxOptionId()',
    },
})
export class ListBoxOptionComponent<TOption> {
    value = input.required<TOption>();
    id = input.required<string>();
    showCheck = input(true);
    selectOption = output<TOption>();

    private optionIdGenerator = inject(OptionIdGenerator);

    protected listBoxOptionId = computed(() => {
        const id = this.optionIdGenerator.nextId();
        return `${this.id()}-${id}`;
    });

    @HostListener('click')
    onSelectOption(): void {
        this.selectOption.emit(this.value());
    }
}
