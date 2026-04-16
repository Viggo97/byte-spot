import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'bsa-svg-icon',
    imports: [],
    template: `
        <svg
            [attr.width]="size()"
            [attr.height]="size()"
            [attr.aria-label]="ariaLabel() ?? null"
            [attr.aria-hidden]="ariaLabel() ? null : true"
            role="img">
            <use [attr.href]="'assets/svg-sprite.svg#' + id()" />
        </svg>
    `,
    styles: [`
        bsa-svg-icon {
            color: var(--bsl-textColor);
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SvgIconComponent {
    id = input.required<string>();
    size = input<string>('1rem');
    ariaLabel = input<string | null>(null);
}
