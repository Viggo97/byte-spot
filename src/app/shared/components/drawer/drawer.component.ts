import {
    animate, style, transition, trigger,
} from '@angular/animations';
import { NgComponentOutlet } from '@angular/common';
import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';

@Component({
    selector: 'bsa-drawer',
    standalone: true,
    imports: [
        NgComponentOutlet,
    ],
    templateUrl: './drawer.component.html',
    styleUrl: './drawer.component.scss',
    animations: [
        trigger('drawerTrigger', [
            transition(':enter', [
                style({ transform: 'translateY(100%)' }),
                animate('150ms cubic-bezier(0, 0, 0.2 , 1)', style({ transform: 'translateY(0)' })),
            ]),
            transition(':leave', [
                animate('150ms cubic-bezier(0, 0, 0.2 , 1)', style({ transform: 'translateY(100%)' })),
            ]),
        ]),
    ],
})
export class DrawerComponent {
    @Input() title: string | null = null;

    @Output() closeDrawer = new EventEmitter<void>();

    onCloseDrawer(): void {
        this.closeDrawer.emit();
    }
}
