import {
    ApplicationRef, ComponentRef, createComponent, Injectable, NgZone, Renderer2, RendererFactory2, Type,
} from '@angular/core';

import { ComponentInputs } from '../../models/component-inputs';
import { OverlayOptions } from '../../models/overlay-options';

@Injectable({
    providedIn: 'root',
})
export class OverlayService<T> {
    private overlay: HTMLDivElement;
    private overlayContent: HTMLDivElement | null = null;
    private backdrop: HTMLDivElement | null = null;
    private disposeBackdropListener: (() => void) | null = null;
    private disposeResizeListener: (() => void) | null = null;
    private componentRef: ComponentRef<T> | null = null;
    private renderer: Renderer2;

    constructor(
        private applicationRef: ApplicationRef,
        private rendererFactory: RendererFactory2,
        private ngZone: NgZone,
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.overlay = document.getElementsByClassName('overlay-container')[0] as HTMLDivElement;
    }

    show(component: Type<T>, options?: OverlayOptions): void {
        this.showOverlayContainer();
        this.createBackdrop(options?.background, options?.closeOnBackdropClick);
        this.createOverlayContent(options);
        this.createComponent(component, options);
    }

    close(): void {
        this.removeComponent();
        this.cleanOverlayContent();
        this.cleanBackdrop();
        this.hideOverlayContainer();
    }

    private showOverlayContainer(): void {
        this.overlay.classList.add('overlay-container-show');
    }

    private hideOverlayContainer(): void {
        this.overlay.classList.remove('overlay-container-show');
    }

    private createComponent(component: Type<T>, options?: OverlayOptions): void {
        this.componentRef = createComponent<T>(component, {
            environmentInjector: this.applicationRef.injector,
            hostElement: this.overlayContent!,
        });
        this.setComponentInputs(options?.componentInputs);
        this.applicationRef.attachView(this.componentRef.hostView);
        this.componentRef.changeDetectorRef.detectChanges();
    }

    private setComponentInputs(inputs: ComponentInputs[] | undefined): void {
        inputs?.forEach((i) => {
            this.componentRef!.setInput(i.name, i.value);
        });
    }

    private removeComponent(): void {
        this.applicationRef.detachView(this.componentRef!.hostView);
        this.componentRef = null;
    }

    createBackdrop(background = true, closeOnBackdropClick = true): void {
        this.backdrop = document.createElement('div');
        this.backdrop.classList.add('backdrop');

        if (background) {
            this.backdrop!.classList.add('backdrop-background');
        }

        if (closeOnBackdropClick) {
            this.disposeBackdropListener = this.renderer.listen(this.backdrop, 'click', () => {
                this.close();
            });
        }

        this.overlay.appendChild(this.backdrop);
    }

    private cleanBackdrop(): void {
        if (this.disposeBackdropListener) {
            this.disposeBackdropListener();
        }
        this.disposeBackdropListener = null;
        this.backdrop?.remove();
    }

    private createOverlayContent(options: OverlayOptions | undefined): void {
        this.overlayContent = document.createElement('div');
        this.overlayContent.classList.add('overlay-content');

        if (options?.directPosition) {
            this.setOverlayDirectPosition(options);
        } else if (options?.relativePosition) {
            this.setOverlayRelativePosition(options);
            this.ngZone.runOutsideAngular(() => {
                this.disposeResizeListener = this.renderer.listen(window, 'resize', () => {
                    this.setOverlayRelativePosition(options);
                });
            });
        } else {
            this.overlayContent.classList.add('overlay-content-center');
        }

        this.overlay.appendChild(this.overlayContent);
    }

    private setOverlayDirectPosition(options: OverlayOptions): void {
        if (this.overlayContent) {
            this.overlayContent.style.top = `${options.directPosition?.top}px`;
            this.overlayContent.style.bottom = `${options.directPosition?.bottom}px`;
            this.overlayContent.style.left = `${options.directPosition?.left}px`;
            this.overlayContent.style.right = `${options.directPosition?.right}px`;
            this.overlayContent.style.width = `${options.directPosition?.width}px`;
            this.overlayContent.style.height = `${options.directPosition?.height}px`;
        }
    }

    private setOverlayRelativePosition(options: OverlayOptions): void {
        if (this.overlayContent) {
            const top = Math.round(options.relativePosition?.relativeElement?.getBoundingClientRect().top || 0);
            const left = Math.round(options.relativePosition?.relativeElement?.getBoundingClientRect().left || 0);
            const offsetY = options?.relativePosition?.offsetY || 0;
            const offsetX = options?.relativePosition?.offsetX || 0;
            this.overlayContent.style.top = `${top + offsetY}px`;
            this.overlayContent.style.left = `${left + offsetX}px`;
            this.overlayContent.style.width = `${options.relativePosition?.width}px`;
            this.overlayContent.style.height = `${options.relativePosition?.height}px`;
        }
    }

    private cleanOverlayContent(): void {
        this.overlayContent = null;
        if (this.disposeResizeListener) {
            this.disposeResizeListener();
        }
        this.disposeResizeListener = null;
    }
}
