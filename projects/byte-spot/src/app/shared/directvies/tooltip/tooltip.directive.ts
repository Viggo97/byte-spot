import { Directive, ElementRef, HostListener, inject, Input } from '@angular/core';
import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { TOOLTIP_POSITIONS } from './tooltip-positions.constants';
import { TooltipComponent } from './tooltip.component';
import { TooltipPosition } from './tooltip-position.enum';

@Directive({
    selector: '[bsaTooltip]',
    standalone: true,
})
export class TooltipDirective {
    private overlay = inject(Overlay);
    private elementRef = inject(ElementRef) as ElementRef<HTMLElement>;

    @Input({ required: true }) set bsaTooltip(value: string) {
        this.message = value;

        if (this.overlayRef?.hasAttached()) {
            this.showTooltip();
        }
    }
    @Input() tooltipPosition: TooltipPosition = TooltipPosition.TOP;

    private message!: string;
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
        this.hideTooltip();

        const positionStrategy = this.createPositionStrategy();
        this.overlayRef = this.overlay.create({ positionStrategy });
        const componentPortal = new ComponentPortal(TooltipComponent);
        const componentInstance = this.overlayRef.attach(componentPortal);
        componentInstance.instance.message = this.message;
    }

    private hideTooltip(): void {
        if (this.overlayRef?.hasAttached()) {
            this.overlayRef.detach();
            this.overlayRef = null;
        }
    }

    private createPositionStrategy(): FlexibleConnectedPositionStrategy {
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.elementRef.nativeElement)
            .withPositions([TOOLTIP_POSITIONS[this.tooltipPosition]]);

        const tooltipOffset = 8;

        switch (this.tooltipPosition) {
            case TooltipPosition.TOP:
                positionStrategy.withDefaultOffsetY(-tooltipOffset);
                break;
            case TooltipPosition.BOTTOM:
                positionStrategy.withDefaultOffsetY(tooltipOffset);
                break;
            case TooltipPosition.LEFT:
                positionStrategy.withDefaultOffsetX(-tooltipOffset);
                break;
            case TooltipPosition.RIGHT:
                positionStrategy.withDefaultOffsetX(tooltipOffset);
                break;
            default:
                break;
        }

        return positionStrategy;
    }
}
