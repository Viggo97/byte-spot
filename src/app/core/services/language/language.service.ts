import { Injectable } from '@angular/core';

import { DropdownContainerComponent } from '../../../shared/ui/dropdown-container/dropdown-container.component';
import { DropdownOption } from '../../../shared/ui/dropdown-container/model/dropdown-option';
import { EdgeX, EdgeY } from '../../models/relative-position-edge';
import { OverlayService } from '../overlay/overlay.service';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    language: string = 'EN';

    constructor(private overlayService: OverlayService<DropdownContainerComponent>) { }

    openLanguageSelection(relativeElement: HTMLButtonElement): void {
        const languageOptions = new Map<string, string>()
            .set('EN', 'English')
            .set('PL', 'Polish');
        this.overlayService.show(DropdownContainerComponent, {
            componentInputs: [
                { name: 'options', value: languageOptions },
            ],
            backdrop: {
                background: false,
            },
            relativePosition: {
                relativeElement,
                edgePositionX: {
                    relativeEdge: EdgeX.LEFT,
                    contentEdge: EdgeX.RIGHT,
                },
                edgePositionY: {
                    relativeEdge: EdgeY.BOTTOM,
                    contentEdge: EdgeY.TOP,
                },
            },
        });

        this.overlayService.outputChange$.subscribe((output) => {
            this.language = (output.value as DropdownOption).key;
            this.overlayService.close();
        });
    }
}
