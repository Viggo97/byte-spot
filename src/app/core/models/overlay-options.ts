import { ComponentInputs } from './component-inputs';

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
    relativeElement?: Element;
    offsetX?: number;
    offsetY?: number;
    width?: number;
    height?: number;
};
