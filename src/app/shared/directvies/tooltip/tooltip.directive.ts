import { Directive, HostListener, inject, Input } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { TooltipComponent } from './tooltip.component';

@Directive({
    selector: '[bsaTooltip]',
    standalone: true,
})
export class TooltipDirective {
    private overlay = inject(Overlay);

    @Input() bsaTooltip!: string;

    private overlayRef: null | OverlayRef = null;

    @HostListener('pointerenter')
    @HostListener('focus')
    onMouseEnter(): void {
        this.showTooltip();
    }

    @HostListener('pointerleave')
    @HostListener('blur')
    onMouseLeave(): void {
        this.hideTooltip();
    }

    private showTooltip(): void {
        this.overlayRef = this.overlay.create();
        const componentPortal = new ComponentPortal(TooltipComponent);
        const componentInstance = this.overlayRef.attach(componentPortal);
        componentInstance.instance.message = this.bsaTooltip;
    }

    private hideTooltip(): void {
        if (this.overlayRef && this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
        }
    }
}
