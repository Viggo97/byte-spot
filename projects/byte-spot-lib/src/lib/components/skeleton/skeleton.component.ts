import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
    selector: 'bsl-skeleton',
    imports: [
        NgClass,
    ],
    templateUrl: './skeleton.component.html',
    styleUrl: './skeleton.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class SkeletonComponent {
    type = input<'rectangle' | 'square' | 'circle'>('rectangle');
    size = input<string>();
    width = input<string>();
    height = input<string>();
}
