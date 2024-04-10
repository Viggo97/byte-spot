import {
    animate, style, transition, trigger,
} from '@angular/animations';
import { Component, EventEmitter } from '@angular/core';

@Component({
    selector: 'bsa-drawer',
    standalone: true,
    imports: [],
    templateUrl: './drawer.component.html',
    styleUrl: './drawer.component.scss',
    animations: [
        trigger('drawerTrigger', [
            transition(':enter', [
                style({ transform: 'translateY(100%)' }),
                animate('150ms', style({ transform: 'translateY(0)' })),
            ]),
            transition(':leave', [
                animate('150ms', style({ transform: 'translateY(100%)' })),
            ]),
        ]),
    ],
})
export class DrawerComponent {
    closeDrawer = new EventEmitter<void>();

    onCloseDrawer(): void {
        this.closeDrawer.emit();
    }
}
