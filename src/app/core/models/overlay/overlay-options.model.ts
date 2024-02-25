import { EdgeX, EdgeY } from '@app/core/enums/overlay/relative-position-edge.enum';
import { ComponentInputs } from '@app/core/models/overlay/component-inputs.model';

export type OverlayOptions =
    BaseOverlayOptions & {
        directPosition?: OverlayDirectContentPosition;
        relativePosition?: never;
    } |
    BaseOverlayOptions & {
        directPosition?: never;
        relativePosition?: OverlayRelativeContentPosition;
    };

type BaseOverlayOptions = {
    componentInputs?: ComponentInputs[];
    backdrop?: OverlayBackdropOptions;
};

export type OverlayBackdropOptions = {
    background?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
};

type OverlayDirectContentPosition = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
    height?: number;
};

type OverlayRelativeContentPosition = {
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
};
