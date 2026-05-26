import { ConnectedPosition } from '@angular/cdk/overlay';
import { TooltipPosition } from './tooltip-position.enum';

export const TOOLTIP_OVERLAY_POSITION: Record<TooltipPosition, ConnectedPosition> = {
    top: {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
    },
    bottom: {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
    },
    left: {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
    },
    right: {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
    },
};
