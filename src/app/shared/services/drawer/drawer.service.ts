import { Injectable } from '@angular/core';
import { OverlayOptions } from '@app/core/models/overlay/overlay-options.model';
import { OverlayService } from '@app/core/services/overlay/overlay.service';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';
import { takeUntil } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DrawerService {
    constructor(private overlayService: OverlayService<DrawerComponent>) { }

    openDrawer(): void {
        const options: OverlayOptions = {
            directPosition: {},
        };

        const [componentRef, closeOverlay$] = this.overlayService.show(DrawerComponent, options);

        componentRef.instance.closeDrawer
            .pipe(takeUntil(closeOverlay$))
            .subscribe(() => {
                this.overlayService.close();
            });
    }
}
