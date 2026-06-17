import { ChangeDetectionStrategy, Component, input, output, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'bsl-chip',
    imports: [],
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ChipComponent {
    iconAriaLabel = input('Remove');
    remove = output();
}
