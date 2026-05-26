import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'bsl-list-box-option',
    imports: [],
    template: `
        <ng-content></ng-content>
        <svg viewBox="0 0 24 24">
            <path d="M4 12.6111L8.92308 17.5L20 6.5" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    `,
    styleUrl: './list-box-option.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'role': 'option',
        '[attr.id]': 'id()',
    },
})
export class ListBoxOptionComponent<TOption> {
    value = input.required<TOption>();
    id = input.required<string>();
}
