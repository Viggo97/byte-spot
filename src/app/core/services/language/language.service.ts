import { Injectable } from '@angular/core';

import { DropdownContainerComponent } from '../../../shared/ui/dropdown-container/dropdown-container.component';
import { OverlayService } from '../overlay/overlay.service';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    constructor(private overlayService: OverlayService<DropdownContainerComponent>) { }

    openLanguageSelection(relativeElement: HTMLButtonElement): void {
        const languageOptions = new Map<string, string>().set('en', 'English').set('pl', 'Polish');
        this.overlayService.show(DropdownContainerComponent, {
            componentInputs: [
                { name: 'options', value: languageOptions },
            ],
            background: false,
            relativePosition: {
                relativeElement,
            },
        });
    }
}
