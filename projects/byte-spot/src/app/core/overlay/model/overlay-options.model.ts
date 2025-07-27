import { EdgeX, EdgeY } from '@app/core/overlay/enum/relative-position-edge.enum';
import { ComponentInputs } from '@app/core/overlay/model/component-inputs.model';

export type OverlayOptions =
    BaseOverlayOptions & {
        directPosition?: OverlayDirectContentPosition;
        relativePosition?: never;
    } |
    BaseOverlayOptions & {
        directPosition?: never;
        relativePosition?: OverlayRelativeContentPosition;
    };

interface BaseOverlayOptions {
    componentInputs?: ComponentInputs[];
    backdrop?: OverlayBackdropOptions;
}

export interface OverlayBackdropOptions {
    background?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
}

interface OverlayDirectContentPosition {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
    height?: number;
}

interface OverlayRelativeContentPosition {
    relativeElement: Element;
    offsetX?: number;
    offsetY?: number;
    edgePositionX?: {
        relativeEdge: EdgeX,
        contentEdge: EdgeX,
    }
    edgePositionY?: {
        relativeEdge: EdgeY,
        contentEdge: EdgeY,
    }
    width?: number;
    height?: number;
}
