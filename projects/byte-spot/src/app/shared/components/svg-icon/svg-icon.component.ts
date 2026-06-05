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
            <use [attr.href]="'#' + name()" />
        </svg>
    `,
    styles: [`
        bsa-svg-icon {
            display: flex;
            height: fit-content;
            width: fit-content;
            color: var(--bsa-textColor-primary);
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
