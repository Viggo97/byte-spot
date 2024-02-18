import { Injectable } from '@angular/core';

import { DropdownContainerComponent } from '../../../shared/components/dropdown-container/dropdown-container.component';
import { DropdownOption } from '../../../shared/models/dropdown-container/dropdown-option';
import { Language } from '../../enums/language/language.enum';
import { EdgeX, EdgeY } from '../../enums/overlay/relative-position-edge.enum';
import { OverlayService } from '../overlay/overlay.service';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    language: string = Language.ENGLISH;

    constructor(private overlayService: OverlayService<DropdownContainerComponent>) { }

    openLanguageSelection(relativeElement: HTMLButtonElement): void {
        const languageOptions = new Map<string, string>()
            .set(Language.ENGLISH, 'English')
            .set(Language.POLISH, 'Polish');

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
