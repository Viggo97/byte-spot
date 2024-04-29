import {
    ApplicationRef, ComponentRef, createComponent,
    NgZone, Renderer2, Type,
} from '@angular/core';
import { EdgeX, EdgeY } from '@app/core/enums/overlay/relative-position-edge.enum';
import { ComponentInputs } from '@app/core/models/overlay/component-inputs.model';
import { OverlayBackdropOptions, OverlayOptions } from '@app/core/models/overlay/overlay-options.model';
import { Keycodes } from '@app/shared/enums/keycodes/keycodes.enum';
import { Subject } from 'rxjs';

type CustomOverlayBackdrop = {
    backdropRef: HTMLDivElement;
    disposeClickListener?: () => void;
    disposeEscapeListener?: () => void;
};

export class CustomOverlay<T> {
    private container!: HTMLDivElement;
    private backdrop!: CustomOverlayBackdrop;
    private overlayContent!: HTMLDivElement;
    private disposeResizeListener!: () => void;
    private closeSource = new Subject<void>();

    componentRef!: ComponentRef<T>;
    close$ = this.closeSource.asObservable();

    constructor(
        private applicationRef: ApplicationRef,
        private renderer: Renderer2,
        private ngZone: NgZone,
    ) {

    }

    create(component: Type<T>, options?: OverlayOptions): CustomOverlay<T> {
        this.createOverlayContainer();
        this.createBackdrop(options?.backdrop);
        this.attachBackdrop();
        this.createOverlayContent();
        this.setOverlayContentPosition(options);
        this.attachOverlayContent();
        this.createComponent(component, options);
        return this;
    }

    close(): void {
        this.removeComponent();
        this.removeOverlayContent();
        this.removeBackdrop();
        this.removeContainer();
        this.closeSource.next();
        this.closeSource.complete();
    }

    private createOverlayContainer(): void {
        this.container = document.createElement('div');
        this.container.classList.add('overlay-container');
        document.body.appendChild(this.container);
    }

    private createBackdrop(options?: OverlayBackdropOptions): void {
        const background = options?.background === undefined ? true : options?.background;
        const closeOnBackdropClick = options?.closeOnBackdropClick === undefined ? true : options?.closeOnBackdropClick;
        const closeOnEscape = options?.closeOnEscape === undefined ? true : options?.closeOnEscape;

        this.backdrop = {
            backdropRef: document.createElement('div'),
        };
        this.backdrop.backdropRef.classList.add('backdrop');

        if (background) {
            this.backdrop.backdropRef.classList.add('backdrop-background');
        }

        if (closeOnBackdropClick) {
            this.backdrop.disposeClickListener = this.renderer.listen(this.backdrop.backdropRef, 'click', () => {
                this.close();
            });
        }

        if (closeOnEscape) {
            this.backdrop.disposeEscapeListener = this.renderer.listen(window, 'keydown', (event: KeyboardEvent) => {
                if (event.code === Keycodes.ESCAPE) {
                    this.close();
                }
            });
        }
    }

    private attachBackdrop(): void {
        this.container.appendChild(this.backdrop.backdropRef);
    }

    private createOverlayContent(): void {
        this.overlayContent = document.createElement('div');
        this.overlayContent.classList.add('overlay-content');
    }

    private setOverlayContentPosition(options?: OverlayOptions): void {
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
    }

    private setOverlayDirectPosition(options: OverlayOptions): void {
        this.overlayContent.style.top = `${options.directPosition?.top}px`;
        this.overlayContent.style.bottom = `${options.directPosition?.bottom}px`;
        this.overlayContent.style.left = `${options.directPosition?.left}px`;
        this.overlayContent.style.right = `${options.directPosition?.right}px`;
        this.overlayContent.style.width = `${options.directPosition?.width}px`;
        this.overlayContent.style.height = `${options.directPosition?.height}px`;
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
                this.overlayContent.style.top = `${relativeElementTop + offsetY}px`;
            }

            if (options.relativePosition.width) {
                this.overlayContent.style.width = `${options.relativePosition.width}px`;
            }

            if (options.relativePosition.height) {
                this.overlayContent.style.height = `${options.relativePosition.height}px`;
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
            this.overlayContent!.style.right = `${document.body.offsetWidth - relativeElementLeft + offset}px`;
        } else if (relativeEdge === EdgeX.RIGHT && contentEdge === EdgeX.LEFT) {
            this.overlayContent!.style.left = `${relativeElementRight + offset}px`;
        } else {
            this.overlayContent!.style.right = `${document.body.offsetWidth - relativeElementRight + offset}px`;
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
            this.overlayContent!.style.bottom = `${document.body.clientHeight - relativeElementTop + offset}px`;
        } else if (relativeEdge === EdgeY.BOTTOM && contentEdge === EdgeY.TOP) {
            this.overlayContent!.style.top = `${relativeElementBottom + offset}px`;
        } else {
            this.overlayContent!.style.bottom = `${document.body.clientHeight - relativeElementBottom + offset}px`;
        }
    }

    private attachOverlayContent(): void {
        this.container.appendChild(this.overlayContent);
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

    private setComponentInputs(inputs?: ComponentInputs[]): void {
        inputs?.forEach((i) => {
            this.componentRef!.setInput(i.name, i.value);
        });
    }

    private removeComponent(): void {
        this.componentRef?.destroy();
        this.applicationRef.detachView(this.componentRef!.hostView);
    }

    private removeOverlayContent(): void {
        if (this.disposeResizeListener) {
            this.disposeResizeListener();
        }
        this.overlayContent.remove();
    }

    private removeBackdrop(): void {
        if (this.backdrop.disposeClickListener) {
            this.backdrop.disposeClickListener();
        }
        if (this.backdrop.disposeEscapeListener) {
            this.backdrop.disposeEscapeListener();
        }
        this.backdrop.backdropRef.remove();
    }

    private removeContainer(): void {
        this.container.remove();
    }
}
