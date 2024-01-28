import {
    ApplicationRef, ComponentRef, createComponent, Injectable, Renderer2, RendererFactory2, Type,
} from '@angular/core';

import { ComponentInputs } from '../../models/component-inputs';
import { OverlayOptions } from '../../models/overlay-options';

@Injectable({
    providedIn: 'root',
})
export class OverlayService<T> {
    private overlay: Element;
    private backdrop: HTMLDivElement | null = null;
    private backdropListener: (() => void) | null = null;
    private componentRef: ComponentRef<T> | null = null;
    private renderer: Renderer2;

    constructor(
        private applicationRef: ApplicationRef,
        private rendererFactory: RendererFactory2,
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.overlay = document.getElementsByClassName('overlay-container')[0] as HTMLDivElement;
    }

    show(component: Type<T>, options?: OverlayOptions): void {
        this.showOverlayContainer();
        this.createBackdrop(options?.background, options?.closeOnBackdropClick);

        const overlayContent = this.createOverlayContent();
        this.componentRef = createComponent<T>(component, {
            environmentInjector: this.applicationRef.injector,
            hostElement: overlayContent,
        });
        this.setInputs(this.componentRef, options?.componentInputs);
        this.applicationRef.attachView(this.componentRef.hostView);
        this.componentRef.changeDetectorRef.detectChanges();
    }

    hide(): void {
        this.hideOverlayContainer();
        this.removeBackdrop();
        this.applicationRef.detachView(this.componentRef!.hostView);
        this.componentRef = null;
    }

    private createOverlayContent(): HTMLDivElement {
        const overlayContent = document.createElement('div');
        overlayContent.classList.add('overlay-content');
        this.overlay.appendChild(overlayContent);
        return overlayContent;
    }

    private showOverlayContainer(): void {
        this.overlay.classList.add('overlay-container-show');
    }

    private hideOverlayContainer(): void {
        this.overlay.classList.remove('overlay-container-show');
    }

    private setInputs(componentRef: ComponentRef<T>, inputs: ComponentInputs[] | undefined): void {
        inputs?.forEach((i) => {
            componentRef.setInput(i.name, i.value);
        });
    }

    createBackdrop(background = true, closeOnBackdropClick = true): void {
        this.backdrop = document.createElement('div');
        this.backdrop.classList.add('backdrop');

        if (background) {
            this.backdrop!.classList.add('backdrop-background');
        }

        if (closeOnBackdropClick) {
            this.backdropListener = this.renderer.listen(this.backdrop, 'click', () => {});
        }

        this.overlay.appendChild(this.backdrop);
    }

    removeBackdrop(): void {
        if (this.backdropListener) {
            this.backdropListener();
        }
        this.backdrop?.remove();
    }
}
