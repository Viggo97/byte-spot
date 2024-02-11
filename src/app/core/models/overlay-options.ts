import { ComponentInputs } from './component-inputs';
import { EdgeX, EdgeY } from './relative-position-edge';

export type OverlayOptions =
    BaseOptions & {
        directPosition?: DirectPosition;
        relativePosition?: never;
    } |
    BaseOptions & {
        directPosition?: never;
        relativePosition?: RelativePosition;
    };

type BaseOptions = {
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
