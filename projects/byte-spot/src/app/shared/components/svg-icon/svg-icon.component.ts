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
            <use [attr.href]="'assets/svg-sprite.svg#' + name()" />
        </svg>
    `,
    styles: [`
        bsa-svg-icon {
            display: flex;
            color: var(--bsl-textColor);
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SvgIconComponent {
    name = input.required<string>();
    size = input<string>('1rem');
    ariaLabel = input<string | null>(null);
}
