import { ComponentInputs } from './component-inputs';
import { ContentPosition } from './content-position';

export interface OverlayOptions {
    componentInputs?: ComponentInputs[];
    background?: boolean;
    closeOnBackdropClick?: boolean;
    contentPosition?: ContentPosition
}
