import { TooltipPosition } from '@app/shared/directvies/tooltip/tooltip-position.enum';
import { ConnectedPosition } from '@angular/cdk/overlay';

export const TOOLTIP_POSITIONS: { [key in TooltipPosition]: ConnectedPosition } = {
    TOP: {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
    },
    BOTTOM: {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
    },
    LEFT: {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
    },
    RIGHT: {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
    },
};
