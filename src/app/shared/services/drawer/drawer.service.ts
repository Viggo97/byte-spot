import { Injectable } from '@angular/core';
import { OverlayService } from '@app/core/services/overlay/overlay.service';
import { DrawerComponent } from '@app/shared/components/drawer/drawer.component';

@Injectable({
    providedIn: 'root',
})
export class DrawerService {
    constructor(private overlayService: OverlayService<DrawerComponent>) { }
}
