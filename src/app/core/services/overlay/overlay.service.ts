import {
    ApplicationRef, ComponentRef, createComponent, Injectable, NgZone, Renderer2, RendererFactory2, Type,
} from '@angular/core';
import { Subject } from 'rxjs';

import { ComponentInputs } from '../../models/component-inputs';
import { OverlayBackdropOptions, OverlayOptions } from '../../models/overlay-options';
import { EdgeX, EdgeY } from '../../models/relative-position-edge';

@Injectable({
    providedIn: 'root',
})
export class OverlayService<T> {
    private renderer: Renderer2;
    private overlay: HTMLDivElement;
    private overlayContent: HTMLDivElement | null = null;
    private backdrop: HTMLDivElement | null = null;
    private disposeBackdropClickListener: (() => void) | null = null;
    private disposeBackdropEscapeListener: (() => void) | null = null;
    private disposeResizeListener: (() => void) | null = null;
    private componentRef: ComponentRef<T> | null = null;
    private lastFocusedElement: HTMLElement | null = null;
    private open = false;
    onClose$ = new Subject<void>();

    constructor(
        private applicationRef: ApplicationRef,
        private rendererFactory: RendererFactory2,
        private ngZone: NgZone,
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.overlay = document.getElementsByClassName('overlay-container')[0] as HTMLDivElement;
    }

    show(component: Type<T>, options?: OverlayOptions): ComponentRef<T> | null {
        if (this.open) {
            return null;
        }
        this.setLastFocusedElement();
        this.showOverlayContainer();
        this.createBackdrop(options?.backdrop);
        this.createOverlayContent(options);
        this.createComponent(component, options);
        this.open = true;
        return this.componentRef;
    }

    close(): void {
        this.open = false;
        this.removeComponent();
        this.cleanOverlayContent();
        this.cleanBackdrop();
        this.hideOverlayContainer();
        this.restoreFocusToPrimaryElement();
        this.onClose$.next();
    }

    private setLastFocusedElement(): void {
        this.lastFocusedElement = (document.activeElement as HTMLElement);
    }

    private restoreFocusToPrimaryElement(): void {
        this.lastFocusedElement?.focus();
        this.lastFocusedElement?.blur();
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
        this.componentRef?.destroy();
        this.applicationRef.detachView(this.componentRef!.hostView);
        this.componentRef = null;
    }

    private createBackdrop(options?: OverlayBackdropOptions): void {
        const background = options?.background !== undefined ? options?.background : true;
        const closeOnBackdropClick = options?.closeOnBackdropClick !== undefined ? options?.closeOnBackdropClick : true;
        const closeOnEscape = options?.closeOnEscape !== undefined ? options?.closeOnEscape : true;

        this.backdrop = document.createElement('div');
        this.backdrop.classList.add('backdrop');

        if (background) {
            this.backdrop!.classList.add('backdrop-background');
        }

        if (closeOnBackdropClick) {
            this.disposeBackdropClickListener = this.renderer.listen(this.backdrop, 'click', () => {
                this.close();
            });
        }

        if (closeOnEscape) {
            this.disposeBackdropEscapeListener = this.renderer.listen(window, 'keyup', (event: KeyboardEvent) => {
                if (event.code === 'Escape') {
                    this.close();
                }
            });
        }

        this.overlay.appendChild(this.backdrop);
    }

    private cleanBackdrop(): void {
        if (this.disposeBackdropClickListener) {
            this.disposeBackdropClickListener();
        }
        if (this.disposeBackdropEscapeListener) {
            this.disposeBackdropEscapeListener();
        }
        this.disposeBackdropClickListener = null;
        this.disposeBackdropEscapeListener = null;
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
        if (this.overlayContent && options.relativePosition) {
            const { relativeElement } = options.relativePosition;
            const { offsetX = 0, offsetY = 0 } = options.relativePosition;

            if (options.relativePosition.edgePositionX) {
                const { relativeEdge, contentEdge } = options.relativePosition.edgePositionX;
                this.setOverlayRelativePositionX(relativeElement, offsetX, relativeEdge, contentEdge);
            } else {
                const relativeElementLeft = Math.round(relativeElement.getBoundingClientRect().left);
                this.overlayContent.style.left = `${relativeElementLeft + offsetX}px`;
            }

            if (options.relativePosition.edgePositionY) {
                const { relativeEdge, contentEdge } = options.relativePosition.edgePositionY;
                this.setOverlayRelativePositionY(relativeElement, offsetY, relativeEdge, contentEdge);
            } else {
                const relativeElementTop = Math.round(relativeElement.getBoundingClientRect().top);
                this.overlayContent.style.top = `${relativeElementTop + offsetX}px`;
            }
        }
    }

    private setOverlayRelativePositionX(
        relativeElement: Element,
        offset: number,
        relativeEdge: EdgeX,
        contentEdge: EdgeX,
    ): void {
        const relativeElementLeft = Math.round(relativeElement.getBoundingClientRect().left);
        const relativeElementRight = Math.round(relativeElement.getBoundingClientRect().right);

        if (relativeEdge === EdgeX.LEFT && contentEdge === EdgeX.LEFT) {
            this.overlayContent!.style.left = `${relativeElementLeft + offset}px`;
        } else if (relativeEdge === EdgeX.LEFT && contentEdge === EdgeX.RIGHT) {
            this.overlayContent!.style.right = `${window.innerWidth - relativeElementLeft + offset}px`;
        } else if (relativeEdge === EdgeX.RIGHT && contentEdge === EdgeX.LEFT) {
            this.overlayContent!.style.left = `${relativeElementRight + offset}px`;
        } else {
            this.overlayContent!.style.right = `${window.innerWidth - relativeElementRight + offset}px`;
        }
    }

    private setOverlayRelativePositionY(
        relativeElement: Element,
        offset: number,
        relativeEdge: EdgeY,
        contentEdge: EdgeY,
    ): void {
        const relativeElementTop = Math.round(relativeElement.getBoundingClientRect().top);
        const relativeElementBottom = Math.round(relativeElement.getBoundingClientRect().bottom);

        if (relativeEdge === EdgeY.TOP && contentEdge === EdgeY.TOP) {
            this.overlayContent!.style.top = `${relativeElementTop + offset}px`;
        } else if (relativeEdge === EdgeY.TOP && contentEdge === EdgeY.BOTTOM) {
            this.overlayContent!.style.bottom = `${window.innerHeight - relativeElementTop + offset}px`;
        } else if (relativeEdge === EdgeY.BOTTOM && contentEdge === EdgeY.TOP) {
            this.overlayContent!.style.top = `${relativeElementBottom + offset}px`;
        } else {
            this.overlayContent!.style.bottom = `${window.innerHeight - relativeElementBottom + offset}px`;
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
