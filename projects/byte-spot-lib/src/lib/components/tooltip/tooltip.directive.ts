import {Directive, ElementRef, inject, input} from '@angular/core';
import {FlexibleConnectedPositionStrategy, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {TooltipComponent} from './tooltip.component';
import {TOOLTIP_OVERLAY_POSITION} from './tooltip-overlay-position.const';
import {TooltipPosition} from './tooltip-position.enum';

@Directive({
    selector: '[bslTooltip]',
    host: {
        '(mouseenter)': 'show()',
        '(mouseleave)': 'hide()',
        '(focus)': 'show()',
        '(blur)': 'hide()',
    },
})
export class TooltipDirective {
    message = input.required<string>({alias: 'bslTooltip'});
    position = input<TooltipPosition>('top');

    private overlay = inject(Overlay);
    private elementRef = inject(ElementRef) as ElementRef<HTMLElement>;

    private overlayRef: null | OverlayRef = null;

    protected show(): void {
        this.hide();
        if (this.message()) {
            const positionStrategy = this.createPositionStrategy();
            this.overlayRef = this.overlay.create({positionStrategy});
            const componentPortal = new ComponentPortal(TooltipComponent);
            const componentInstance = this.overlayRef.attach(componentPortal);
            componentInstance.instance.message.set(this.message());
        }
    }
    protected hide(): void {
        if (this.overlayRef?.hasAttached()) {
            this.overlayRef.detach();
            this.overlayRef = null;
        }
    }

    private createPositionStrategy(): FlexibleConnectedPositionStrategy {
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.elementRef.nativeElement)
            .withPositions([TOOLTIP_OVERLAY_POSITION[this.position()]]);

        const tooltipOffset = 8;

        switch (this.position()) {
            case 'top':
                positionStrategy.withDefaultOffsetY(-tooltipOffset);
                break;
            case 'bottom':
                positionStrategy.withDefaultOffsetY(tooltipOffset);
                break;
            case 'left':
                positionStrategy.withDefaultOffsetX(-tooltipOffset);
                break;
            case 'right':
                positionStrategy.withDefaultOffsetX(tooltipOffset);
                break;
            default:
                break;
        }

        return positionStrategy;
    }
}
