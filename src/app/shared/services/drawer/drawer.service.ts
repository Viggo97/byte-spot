import { Injectable, Type } from '@angular/core';
import { ComponentInputs } from '@app/core/models/overlay/component-inputs.model';
import { OverlayOptions } from '@app/core/models/overlay/overlay-options.model';
import { OverlayService } from '@app/core/services/overlay/overlay.service';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';
import { takeUntil } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawerService {
    constructor(private overlayService: OverlayService<DrawerComponent<unknown>>) { }

    openDrawer(component: Type<unknown>, componentInputs: ComponentInputs[] = []): void {
        const options: OverlayOptions = {
            directPosition: {},
            componentInputs: [
                {
                    name: 'component',
                    value: component,
                },
                {
                    name: 'inputs',
                    value: componentInputs,
                },
            ],
        };

        const [componentRef, closeOverlay$] = this.overlayService.show(DrawerComponent, options);

        componentRef.instance.closeDrawer
            .pipe(takeUntil(closeOverlay$))
            .subscribe(() => {
                this.overlayService.close();
            });
    }
}
