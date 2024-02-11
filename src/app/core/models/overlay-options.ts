import { ComponentInputs } from './component-inputs';
import { EdgeX, EdgeY } from './relative-position-edge';

export type OverlayOptions =
    BaseOverlayOptions & {
        directPosition?: DirectPosition;
        relativePosition?: never;
    } |
    BaseOverlayOptions & {
        directPosition?: never;
        relativePosition?: RelativePosition;
    };

type BaseOverlayOptions = {
    componentInputs?: ComponentInputs[];
    background?: boolean;
    closeOnBackdropClick?: boolean;
};

type DirectPosition = {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    width?: number;
    height?: number;
};

type RelativePosition = {
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
