import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'bsl-list-box-group',
    imports: [],
    template: `
        @if (title()) {
            <div class="bsl-list-box-group-title">{{ title() }}</div>
        }
        <ng-content></ng-content>
  `,
    styleUrl: './list-box-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ListBoxGroupComponent {
    title = input<string>();
}
