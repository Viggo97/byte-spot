import {
    ApplicationRef,
    Injectable,
    NgZone,
    Renderer2, RendererFactory2,
    Type,
} from '@angular/core';
import { OverlayOptions } from '@app/core/overlay/model/overlay-options.model';
import { CustomOverlay } from '@app/core/overlay/custom-overlay';

/**
 * @deprecated Use CDK Overlay instead - it has more functionalities
 */
@Injectable({
    providedIn: 'root',
})
export class OverlayService<T> {
    private renderer: Renderer2;

    constructor(
        private applicationRef: ApplicationRef,
        private rendererFactory: RendererFactory2,
        private ngZone: NgZone,
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    show(component: Type<T>, options?: OverlayOptions): CustomOverlay<T> {
        return new CustomOverlay<T>(
            this.applicationRef,
            this.renderer,
            this.ngZone,
        ).create(component, options);
    }
}
