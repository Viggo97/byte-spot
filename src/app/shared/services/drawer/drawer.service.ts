import { Injectable, Type } from '@angular/core';
import { OverlayOptions } from '@app/core/models/overlay/overlay-options.model';
import { CustomOverlay } from '@app/core/services/overlay/custom-overlay';
import { OverlayService } from '@app/core/services/overlay/overlay.service';
import { Drawer } from '@app/shared/models/drawer.interface';
import { takeUntil } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawerService {
    overlay!: CustomOverlay<Drawer>;

    constructor(private overlayService: OverlayService<Drawer>) { }

    openDrawer(component: Type<Drawer>): void {
        const options: OverlayOptions = {
            directPosition: {},
        };

        this.overlay = this.overlayService.show(component, options);

        this.overlay.componentRef.instance.closeDrawer
            .pipe(takeUntil(this.overlay.close$))
            .subscribe(() => {
                this.overlay.close();
            });
    }

    closeDrawer(): void {
        this.overlay.close();
    }
}
