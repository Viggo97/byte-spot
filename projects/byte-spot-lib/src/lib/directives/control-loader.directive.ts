import { Directive, inject, ElementRef, Renderer2, input, effect } from '@angular/core';

@Directive({
    selector: '[bslControlLoader]',
    host: {'[style.padding-right]': '_elementPaddingRight'},
})
export class ControlLoaderDirective {
    private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly _renderer = inject(Renderer2);

    isVisible = input.required<boolean>({alias: 'bslControlLoader'});

    protected readonly _elementPaddingRight = '2rem';
    private _spinnerRef!: HTMLElement;

    constructor() {
        effect(() => {
            this.setVisibility(this.isVisible());
        });

        this.buildSpinner();
    }

    private buildSpinner(): void {
        const parent = this._elementRef.nativeElement.parentNode;

        const wrapper = this._renderer.createElement('div') as HTMLElement;
        this._renderer.addClass(wrapper, 'bsl-control-loader-base');

        this._renderer.insertBefore(parent, wrapper, this._elementRef.nativeElement);
        this._renderer.appendChild(wrapper, this._elementRef.nativeElement);

        this._spinnerRef = this._renderer.createElement('span') as HTMLElement;
        this._renderer.addClass(this._spinnerRef, 'bsl-control-loader');
        this._renderer.setAttribute(this._spinnerRef, 'aria-hidden', 'true');
        this.setVisibility(true);

        this._renderer.appendChild(wrapper, this._spinnerRef);
    }

    private setVisibility(visible: boolean): void {
        this._renderer.setStyle(
            this._spinnerRef,
            'display',
            visible ? 'block' : 'none',
        );
    }
}
