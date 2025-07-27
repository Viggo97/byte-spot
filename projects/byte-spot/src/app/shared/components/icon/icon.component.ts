import { Component, Input } from '@angular/core';

@Component({
    selector: 'bsa-icon',
    imports: [],
    template: `
        <svg [attr.width]="size" [attr.height]="size" [attr.fill]="fill" [attr.stroke]="stroke" [class]="customClass">
            <use [attr.href]="path"></use>
        </svg>
  `,
    styles: `
      :host {
          display: inline-flex;
          justify-content: center;
          align-items: center;
      }
    `,
})
export class IconComponent {
    private location = 'assets/svg/icons';

    protected path!: string;
    @Input({ required: true }) set name(value: string) {
        this.path = `${this.location}/${value}.svg#${value}`;
    }

    private _size = '1rem';
    get size(): string { return this._size; }
    @Input() set size(value: number | string) {
        this._size = typeof value === 'number' ? `${value}px` : value;
    }

    @Input() fill = 'currentColor';
    @Input() stroke = 'currentColor';
    @Input() customClass = '';
}
