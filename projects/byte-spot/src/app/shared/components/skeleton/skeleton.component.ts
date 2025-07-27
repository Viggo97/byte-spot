import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'bsa-skeleton',
    imports: [
        NgClass,
    ],
    template: `
        <div class="skeleton"
             [ngClass]="type"
             [style.width]="type === 'rectangle' ? width : size"
             [style.height]="type === 'rectangle' ? height : size">
        </div>
    `,
    styleUrl: './skeleton.component.scss',
})
export class SkeletonComponent {
    @Input() type: 'rectangle' | 'square' | 'circle' = 'rectangle';
    @Input() size?: string;
    @Input() width?: string;
    @Input() height?: string;
}
