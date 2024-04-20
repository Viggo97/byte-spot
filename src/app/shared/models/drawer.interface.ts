import { EventEmitter } from '@angular/core';

export interface Drawer {
    closeDrawer: EventEmitter<void>;
}
