import { Injectable, Type } from '@angular/core';
import { OverlayOptions } from '@app/core/models/overlay/overlay-options.model';
import { OverlayService } from '@app/core/services/overlay/overlay.service';
import { Drawer } from '@app/shared/models/drawer.interface';
import { takeUntil } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawerService {
    constructor(private overlayService: OverlayService<Drawer>) { }

    openDrawer(component: Type<Drawer>): void {
        const options: OverlayOptions = {
            directPosition: {},
        };

        const [componentRef, closeOverlay$] = this.overlayService.show(component, options);

        componentRef.instance.closeDrawer
            .pipe(takeUntil(closeOverlay$))
            .subscribe(() => {
                this.overlayService.close();
            });
    }

    closeDrawer(): void {
        this.overlayService.close();
    }
}
